// This function is strictly for debugging
function consolePrintState(state) {
    for (let row = 8; row >= 0; row--) {
        let a = []
        a.push(row + 1)
        for (let column = 0; column < 12; column++) {
            if (state[row][column].container)
                a.push(state[row][column].container.weight)
            else if (state[row][column].deadSpace)
                a.push("X")
            else   
                a.push('•')
        }
        console.log(a.join('\t'))
    }

    let a = []
    a.push(' ')
    for (let i = 1; i < 13; i++) {
        a.push(i)
    }
    console.log(a.join('\t'))
}

class Node {
	constructor(ship) {
		this.state = structuredClone(ship) // should make a copy of "ship" grid array
		this.pathCost = 0 // total path cost (actual cost in minutes to get to current state)
		this.heuristicCost = 0 // estimated cost in minutes left to reach balance
        // ((old row, old column), (new row, new column))
		this.move = [[8,0],[8,0]] // initial crane position
		this.parent = null
	}
}

const OLD = 0
const NEW = 1
const ROW = 0
const COLUMN = 1

export function balance(ship) {  // returns instructions to balance, already balanced returns empty instructions  
    console.log("Initial State:")
    //console.log(ship);
    consolePrintState(ship)
    console.log("CHECKING BALANCE...")

    if (isBalanced(ship)) {
        console.log("ALREADY BALANCED")
        return {cost: 0, instruction: []} // returns empty instructions if already balanced
    } 
    else if (balancePossible(ship)) {
        console.log("NOT BALANCED, BALANCING...")
        return balanceSearch(ship)
    } 
    else {
        console.log("IMPOSSIBLE TO BALANCE, SIFTING...")
        return performSIFT(ship)
    }
}

function isBalanced(state) { // returns true if balanced, false if isn't 
    //MIGHT BE BETTER TO STORE LEFT AND RIGHT SUMS AS NODE VARIABLES TO SPEED IT UP (A LOT LESS LOOPS)
    let leftSum = 0
    for (let column = 0; column < 6; column++) {
        let row = 0
        while (row < 9 && state[row][column].deadSpace == 1)
            row++
        
        while (row < 9 && state[row][column].container !== null) {
            leftSum += state[row][column].container.weight
            row++
        }
    }

    let rightSum = 0
    for (let column = 6; column < 12; column++) {
        let row = 0
        while (row < 9 && state[row][column].deadSpace == 1)
            row++
        
        while (row < 9 && state[row][column].container !== null) {
            rightSum += state[row][column].container.weight
            row++
        }
    }

    let isBalanced = (Math.min(leftSum, rightSum) / Math.max(leftSum, rightSum)) >= 0.9

    if (isBalanced) {
        console.log("Balanced State:")
        consolePrintState(state)
        //console.log(state)
        return true
    }
    else return false
}

function balancePossible(state) { // returns true if possible to balance, false if impossible
    return true
}

function balanceSearch(state) { // returns instructions for fastest balance
    let initialNode = new Node(state)
	// Create a data structure to store the paths that are being explored
	let frontier = [initialNode]

	// Create an empty data structure to store the explored paths
	let explored = []
	
    // While there are paths being explored
    while (frontier.length > 0) {
        // Sort the paths in the frontier by total cost (path + heuristic cost), with the lowest-cost paths first
        frontier.sort(function(a, b) {
            return (a.pathCost + a.heuristicCost) - (b.pathCost + b.heuristicCost)
        })

        // Choose the lowest-cost path from the frontier
        let node = frontier.shift()

        // Add this nodeto the explored paths
        explored.push(node)
        // If this node reaches the goal, return the node 
        if (isBalanced(node.state)) {
            console.log("SUCCESS! Balance Instructions:")

            return getInstructions(node)
        }

        frontier = expand(frontier, explored, node)
    }

    // If there are no paths left to explore, return null to indicate that the goal cannot be reached
    console.log("ERROR: No Balance found!")
    return null //Should never reach here
}

function expand(frontier, explored, node) { // branching function, max 12x11 branches
    console.log("EXPANDING NODE")

    // For every column, check every column
    // o: old column, n: new column
    for (let o = 0; o < 12; o++) {
        // if not moving container just moved OR doing first move 
        // formerly used to check if column has containers by only checking bottom row, but this would not work if first row is NANs
        if (o != node.move[NEW][COLUMN] || node.move[OLD] == node.move[NEW]) {       // **NEED TO CHANGE TO CORRECTLY COMPARE ARRAYS**
            for (let n = 0; n < 12; n++) {
                if (n != o && node.state[8][n].container === null) { // if not making redundant move, and coulumn has available spot at top
                    let move = getMove(node.state, o, n)
                    if (move.length > 0) { // if move is valid (old column must have at least 1 container)
                        let tempState = getNewState(node.state, move)
                        
                        // Check if this state has already been explored
                        let isExplored = (explored.find( e => {
                            return e.state == tempState                     // ***NEED TO CHANGE FOR COMPARING ARRAYS TO WORK PROPERLY***
                        }))
                        
                        // avoid repeated nodes during the calculation of neighbors
                        let isFrontier = (frontier.find( e => {
                            return e.state == tempState                     // ***NEED TO CHANGE FOR COMPARING ARRAYS TO WORK PROPERLY***      
                        }))
                        
                        
                        // If this state has not been explored
                        if (!isExplored && !isFrontier) {
                            let tempNode = new Node(tempState)
                            tempNode.pathCost = node.pathCost + getPathCost(node, move)
                            tempNode.heuristicCost = getHeuristicCost(tempState)
                            tempNode.move = move
                            tempNode.parent = node

                            // Add the step to the frontier, using the cost and the heuristic function to estimate the total cost to reach the goal
                            frontier.push(tempNode)
                        }
                    }
                }
            }
        }
    }
    return frontier
}

function getMove(state, oldColumn, newColumn) { // returns empty array if move is invalid
    let oldRow = 0
    while (oldRow < 9 && state[oldRow][oldColumn].deadSpace == 1)
        oldRow++

    // ***NEED TO ADD CHECK THAT NO CONTAINERS ARE IN ROW 8 BETWEEN OLD AND NEW COLUMNS***
    
    if (oldRow == 9 || state[oldRow][oldColumn].container === null) // returns invalid if no containers in oldColumn
        return []

    while (oldRow < 8 && state[oldRow + 1][oldColumn].container !== null) // finds top container row in old column
        oldRow++ // increment if container on top of cell

    let newRow = 0
    while (newRow < 9 && (state[newRow][newColumn].container !== null || state[newRow][newColumn].deadSpace == 1)) // finds top empty cell in new column
        newRow++ // increment if cell has container

    return [[oldRow, oldColumn], [newRow, newColumn]] // the move is returned               
}

function getNewState(oldState, move) {
    var newState = structuredClone(oldState)
    newState[move[OLD][ROW]][move[OLD][COLUMN]] = {container: null, deadSpace: 0} // replace old location with empty cell
    newState[move[NEW][ROW]][move[NEW][COLUMN]] = oldState[move[OLD][ROW]][move[OLD][COLUMN]] // container is now in new cell    
    return newState
}

function getPathCost(node, move) {
    let cost = 0
    
    // First will add cost to move crane to old container location
    // add Manhattan Distance to cost
    cost += Math.abs(node.move[NEW][ROW] - move[OLD][ROW]) // add vertical crane distance to cost
    cost += Math.abs(node.move[NEW][COLUMN] - move[OLD][COLUMN]) // add horizontal crane distance to cost
    
    let maxMoveHeight = Math.max(node.move[NEW][ROW], move[OLD][ROW])
    let maxObstacleHeight = maxMoveHeight
    let left = Math.min(node.move[NEW][COLUMN], move[OLD][COLUMN])
    let right = Math.max(node.move[NEW][COLUMN], move[OLD][COLUMN])
    
    for (let column = left + 1; column < right; column++) { // for all columns between old and new locations
        let row = 0
        while (row < 9 && node.state[row][column].deadSpace == 1)
            row++
        
        while (row < 9 && node.state[row][column].container !== null)
            row++
        
        if (row > maxObstacleHeight)
            maxObstacleHeight = row
    }
    cost += 2 * (maxObstacleHeight - maxMoveHeight) // what goes up must come down



    // Next will add actual cost of move
    // add Manhattan Distance to cost
    cost += Math.abs(move[NEW][ROW] - move[OLD][ROW]) // add vertical distance to cost
    cost += Math.abs(move[NEW][COLUMN] - move[OLD][COLUMN]) // add horizontal distance to cost

    maxMoveHeight = Math.max(move[NEW][ROW], move[OLD][ROW])
    maxObstacleHeight = maxMoveHeight
    left = Math.min(move[NEW][COLUMN], move[OLD][COLUMN])
    right = Math.max(move[NEW][COLUMN], move[OLD][COLUMN])
    for (let column = left + 1; column < right; column++) {
        let row = 0
        while (row < 9 && node.state[row][column].deadSpace == 1)
            row++
        
        while (row < 9 && node.state[row][column].container !== null)
            row++
        
        if (row > maxObstacleHeight)
            maxObstacleHeight = row
    }
    cost += 2 * (maxObstacleHeight - maxMoveHeight) // what goes up must come down

    return cost
}
 
function getHeuristicCost(state) {
    return 0
}

function performSIFT(state) { // return instructions for SIFT
    return []
}

function getInstructions(node) {
    var instructions = []
	instructions = getInstructionsHelper(node, instructions)
    return {cost: node.pathCost, steps: instructions}
}

function getInstructionsHelper(node, instructions) {
    // Print steps in order but not the very first redundant one (used to store intial crane position)
    if (node.parent != null && node.parent.parent != null)
        getInstructionsHelper(node.parent, instructions)
    
    //instructions.push(node.move)
    instructions.push({stepCost: (node.pathCost - node.parent.pathCost), stepState: node.state, step: node.move})
    return instructions
}