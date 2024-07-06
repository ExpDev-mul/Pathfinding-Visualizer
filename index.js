const path = document.getElementById('path')

function wait(s){
    return new Promise(resolve => setTimeout(resolve, s*1000));
}

let mouseDown = false
document.addEventListener('mousedown', function(event) {
    mouseDown = true
})

document.addEventListener('mouseup', function(event) {
    mouseDown = false
})

let wide = 15
let high = 15

let width = 800
let height = 800

let gapX = 5
let gapY = 5

let blocks = []
function SetBlockColor(x, y, color){
    blocks[x][y].style.backgroundColor = color;
}


let walls = []
function IsAWall(x, y){
    for (let i = 0; i < walls.length; i++){
        let wall = walls[i]
        if (wall[0] == x && wall[1] == y){
            return true;
        }
    }

    return false;
}

function SetWall(x, y, isWall, dontRecolor){
    if (isWall){
        walls.push([x, y])
        SetBlockColor(x, y, "rgb(255, 0, 0)")
    } else {
        for (let i = 0; i < walls.length; i++){
            let wallNode = walls[i]
            if (wallNode[0] == x && wallNode[1] == y){
                walls.splice(i, 1);
            }
        }

        if (!dontRecolor){
            SetBlockColor(x, y, "rgba(0, 0, 0, 0.3)")
        }
    }
}

let golds = []
function IsAGold(x, y){
    for (let i = 0; i < golds.length; i++){
        let gold = golds[i]
        if (gold[0] == x && gold[1] == y){
            return true;
        }
    }

    return false;
}

function SetGold(x, y, isGold, dontRecolor){
    if (isGold){
        golds.push([x, y])
        SetBlockColor(x, y, "rgb(255, 215, 0)")
    } else {
        for (let i = 0; i < golds.length; i++){
            let goldNode = golds[i]
            if (goldNode[0] == x && goldNode[1] == y){
                golds.splice(i, 1);
            }
        }

        if (!dontRecolor){
            SetBlockColor(x, y, "rgba(0, 0, 0, 0.3)")
        }
    }
}

let placementSelection = -1 // 0 is Wall, 1 is Gold
const wallButton = document.getElementById("wall")
const goldButton = document.getElementById("gold")

function WallClick(){
    if (placementSelection != 0){
        placementSelection = 0
        wallButton.classList.add('placementSelected')
        goldButton.classList.remove('placementSelected')
    }
}

wallButton.addEventListener('click', WallClick)

goldButton.addEventListener('click', () => {
    if (placementSelection != 1){
        placementSelection = 1
        goldButton.classList.add('placementSelected')
        wallButton.classList.remove('placementSelected')
    }
})

WallClick()

function UpdateGrid(){
    for (let x = 0; x < blocks.length; x++){
        for (let y = 0; y < blocks.length; y++){
            blocks[x][y].remove()
        }
    }

    blocks = []
    for (let x = 0; x < wide; x++){
        let blocksRow = []
        for (let y = 0; y < high; y++){
            const block = document.createElement('div')
            block.style.marginLeft = x*(width/wide) + gapX/2 + "px"
            block.style.marginTop = y*(height/high) + gapY/2 + "px"
            block.style.position = "absolute"
            block.style.width = (width/wide - gapX) + "px"
            block.style.height = (height/high - gapY) + "px"
            block.classList.add("node")

            if ((x == 0 && y == 0)){
                const span = document.createElement('span')
                span.innerHTML = "START"
                span.style.fontFamily = "Roboto"
                span.style.fontWeight = "bold"
                span.style.position = "absolute"
                span.style.marginLeft = "calc(50% - 19px)"
                span.style.marginTop = "calc(50% - 8px)"
                span.style.fontSize = "13px"
                block.appendChild(span)
            } else if (x == wide - 1 &&  y == high - 1){
                const span = document.createElement('span')
                span.innerHTML = "END"
                span.style.fontFamily = "Roboto"
                span.style.fontWeight = "bold"
                span.style.position = "absolute"
                span.style.marginLeft = "calc(50% - 12px)"
                span.style.marginTop = "calc(50% - 8px)"
                span.style.fontSize = "13px"
                block.appendChild(span)
            } else {
                block.addEventListener('mouseenter', () => {
                    if (mouseDown)
                    {
                        if (placementSelection == 0){
                            SetGold(x, y, false, true)
                            SetWall(x, y, !IsAWall(x, y))
                        } else if (placementSelection == 1){
                            SetWall(x, y, false, true)
                            SetGold(x, y, !IsAGold(x, y))
                        }
                    }
                })

                block.addEventListener('mousedown', () => {
                    if (placementSelection == 0){
                        SetGold(x, y, false, true)
                        SetWall(x, y, !IsAWall(x, y))
                    } else if (placementSelection == 1){
                        SetWall(x, y, false, true)
                        SetGold(x, y, !IsAGold(x, y))
                    }
                })
            }

            path.appendChild(block)
            blocksRow.push(block)
        }

        blocks.push(blocksRow)
    }
}

UpdateGrid()

const start = document.getElementById('aStar')

const algorithmExpandOptionsContainer = document.getElementById('algorithmExpandOptionsContainer')
algorithmExpandOptionsContainer.style.opacity = 0

const algorithmExpand = document.getElementById('algorithmExpand')

let expansion = ["A*", "Dijkstra"]

let algorithmExpanded = false
function ToggleAlgorithmExpand(enabled){
    algorithmExpanded = enabled
    if (algorithmExpanded){
        algorithmExpandOptionsContainer.style.opacity = 1
        algorithmExpand.style.transform = "rotate(0deg)"
    } else {
        algorithmExpandOptionsContainer.style.opacity = 0
        algorithmExpand.style.transform = "rotate(180deg)"
    }
}

algorithmExpand.addEventListener('click', () => {
    ToggleAlgorithmExpand(!algorithmExpanded)
})

const algorithmDescriptions = {
    "A*": "It computes the cost of every adjacent node to the starting node, with a heuristic aspect within the computation. Thereafter, it repeats that same process until the end node is reached. This is an improved version of Dijkstra's algorithm.",
    "Dijkstra": "This algorithm computes the cost of every adjcent node to the starting node, without a heuristic aspect, and repeat the process until the end node is reached. You may think of this as A* algorithm where the heuristic function is leveled at zero."
}

let algorithmTitle = document.getElementById('algorithmTitle')
let algorithmDescription = document.getElementById("algorithmDescription")
let algorithm = "A*"
expansion.forEach((el) => {
    const option = document.getElementById('expandAlgorithmOption' + el)
    option.addEventListener('click', () => {
        ToggleAlgorithmExpand(false)
        start.innerHTML = "<b>" + el + "</b>"
        algorithm = el

        algorithmTitle.innerHTML = "<b>" + el + "</b>"
        algorithmDescription.innerHTML = algorithmDescriptions[el]
    })
})

algorithmTitle.innerHTML = "<b>" + algorithm + "</b>"
algorithmDescription.innerHTML = algorithmDescriptions[algorithm]

// Algorithms Implementation

let opened = []
let closed = []
class Node {
    constructor(x, y, parent = null) {
        for (let i = 0; i < closed.length; i++){
            if (closed[i].x == x && closed[i].y == y){
                return null;
            }
        }

        for (let i = 0; i < opened.length; i++){
            if (opened[i].x == x && opened[i].y == y){
                return null;
            }
        }

        for (let i = 0; i < golds.length; i++){
            if (golds[i].x == x && golds[i].y == y){
                return null;
            }
        }

        if ((x >= 0 && x < blocks.length) && (y >= 0 && y < blocks[0].length) && !IsAWall(x, y)){
            this.init = true
            this.x = x;
            this.y = y;
            this.parent = parent;
            this.G = 0;
            this.H = 0;
            this.F = 0;
        } else {
            return null;
        }
    }

    calculateGCost() {
        if (this.parent) {
            this.G = this.parent.G + 1;
        }
    }

    calculateHCost(end, isZero) {
        // Compute the heuristic cost with Manhatten Distance
        if (!isZero){
            this.H = Math.abs(end.x - this.x) + Math.abs(end.y - this.y)
        }
    }

    getFCost(){
        return this.G + this.H*1.2
    }

    equals(node){
        return (this.x == node.x && this.y == node.y)
    }

    color(color){
        SetBlockColor(this.x, this.y, color)
    }
}

let visualizationStepDeltaTime = 0.05

async function AStar(start, end, isDijkstra){            
    let steps = 0

    let current = start
    
    while (!current.equals(end) && steps < 10000){
        if (visualizationStepDeltaTime > 0)
        {
            await wait(visualizationStepDeltaTime)
        }

        steps += 1
        

        current.color("rgb(0, 0, 0)")
        let neighbours = [
            // All adjacent nodes
            new Node(current.x + 1, current.y, current, closed),
            new Node(current.x, current.y + 1, current, closed),
            new Node(current.x - 1, current.y, current, closed),
            new Node(current.x, current.y - 1, current, closed)

           //  new Node(current.x + 1, current.y + 1, current, closed),
            // new Node(current.x - 1, current.y + 1, current, closed),

        ]    

        let minimumF = Infinity
        let minimumNode = null;

        neighbours.forEach((el) => {
            if (el.init == true)
            {
                el.calculateGCost()
                el.calculateHCost(end, isDijkstra)
                el.color("rgb(255, 125, 0)")
                opened.push(el)
            }
        })

        opened.forEach((el) => {
            let F = el.getFCost()
            if (F < minimumF){
                minimumF = F
                minimumNode = el
            }
        })

        current = minimumNode
        closed.push(current)
        for (let i = 0; i < opened.length; i++){
            if (opened[i] == current){
                opened.splice(i, 1)
                break;
            }
        }
    }

    // The path was succesfully computed!

    current.color("rgb(0, 0, 0)")

    while (current != null){
        if (visualizationStepDeltaTime > 0)
        {
            await wait(visualizationStepDeltaTime)
        }

        current.color("rgb(0, 255, 0)")
        current = current.parent
    }
}




start.addEventListener('click', async function(){
    opened = []
    closed = []

    let current = new Node(0, 0)

    for (let i = 0; i < golds.length; i++){
        let gold = golds[i]
        let dest = new Node(gold[0], gold[1])
        if (algorithm == "A*"){
            await AStar(current, dest)
        } else if (algorithm == "Dijkstra"){
            await AStar(current, dest, true)
        }

        current = dest
        opened = []
        // closed = []
    }

    if (algorithm == "A*"){
        await AStar( current , new Node(blocks.length - 1, blocks[0].length - 1) )
    } else if (algorithm == "Dijkstra"){
        await AStar( current , new Node(blocks.length - 1, blocks[0].length - 1), true )
    }
})

function RandomizeNumber(min, max, mustBeEven){
    let num;
    do {
        num = min + Math.floor((max - min)*Math.random());
    } while ((num % 2 != 0) && (mustBeEven))
    return num;
}

let visited = []
function IsVisited(node){
    for (let i = 0; i < visited.length; i++){
        let visitedNode = visited[i]
        if (visitedNode[0] == node[0] && visitedNode[1] == node[1]){
            return true;
        }
    }

    return false;
}

function InBounds(x, y){
    return (x >= 0 && x < blocks.length) && (y >= 0 && y < blocks[0].length)
}

async function GenerateMaze(x, y){
    visited.push([x, y])
    let neighbours = [
        [x + 2, y],
        [x, y + 2],
        [x - 2, y],
        [x, y - 2]
    ]

    SetWall(x, y, false)

    if (visualizationStepDeltaTime > 0)
    {
        await wait(visualizationStepDeltaTime)
    }

    let totalNeighbours = neighbours.length;

    let steps = 0;
    while (steps < totalNeighbours){
        let index = await RandomizeNumber(0, neighbours.length - 1)
        let neighbour = neighbours[index]
        neighbours.splice(index, 1)
        steps++;

        if (!InBounds(neighbour[0], neighbour[1])){
            continue;
        }

        if (!IsVisited(neighbour)){
            let wall = [(x + neighbour[0])/2, (y + neighbour[1])/2]
            SetWall(wall[0], wall[1], false)
            await GenerateMaze(neighbour[0], neighbour[1])
            continue;
        }
    }
}

document.getElementById('maze').addEventListener('click', () => {
    if (wide % 2 == 0){
        // Cannot generate maze for even grid sizes.
        return;
    }

    for (let x = 0; x < blocks.length; x++){
        for (let y = 0; y < blocks[0].length; y++){
            SetWall(x, y, true)
        }
    }

    visited = []
    GenerateMaze( RandomizeNumber(0, blocks.length - 1, true), RandomizeNumber(0, blocks[0].length - 1, true) )
})

async function Clear(){
    opened = []
    closed = []
    visited = []
    golds = []
    for (let x = 0; x < blocks.length; x++){
        for (let y = 0; y < blocks[0].length; y++){
            SetWall(x, y, false)
        }
    }
}

document.getElementById('clear').addEventListener('click', () => {
    Clear()
})

const gridSize = document.getElementById("gridSize")
gridSize.addEventListener('change', (event) => {
    let newValue = event.target.value
    if (newValue <= 0){
        return;
    }

    console.log("Updated grid size: " + newValue)
    Clear()
    wide = newValue
    high = newValue
    UpdateGrid()
})

const page = document.getElementById('page')
const settingsDiv = document.getElementById('settingsDiv')

let settingsOpen = false;
document.getElementById('settingsButton').addEventListener('click', () => {
    settingsOpen = !settingsOpen
    if (settingsOpen){
        page.style.filter = "blur(2px)"
        settingsDiv.style.visibility = "visible"
    } else {
        page.style.filter = "blur(0px)"
        settingsDiv.style.visibility = "hidden"
    }
})

const vsdtSetting = document.getElementById('vsdtSetting')
let vsdtLength = 0;
vsdtSetting.addEventListener('change', (event) => {
    let newValue = event.target.value
    vsdtLength = newValue.length
    if (newValue < 0){
        return;
    }

    visualizationStepDeltaTime = newValue/1000
    console.log(visualizationStepDeltaTime)
})

const vsdtSettingOverlay = document.getElementById('vsdtSettingOverlay')
vsdtSetting.addEventListener('focus', () => {
    vsdtSettingOverlay.classList.add("settingOverlayFocus")
})

vsdtSetting.addEventListener('blur', () => {
    if (vsdtLength > 0)
    {
        return;
    }

    vsdtSettingOverlay.classList.remove("settingOverlayFocus")
})
