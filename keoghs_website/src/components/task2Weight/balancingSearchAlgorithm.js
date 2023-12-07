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
        return {cost: 0, steps: []} // returns empty instructions if already balanced
    } 
    else if (balanceIsPossible(ship)) {
        console.log("UNBALANCED & BALANCE POSSIBLE, BALANCING...")
        return balanceSearch(ship) 
    } 
    else {
        console.log("UNBALANCED & IMPOSSIBLE TO BALANCE, SIFTING...")
        return performSIFT(ship)
    }

    //getHeuristicCost(ship) // FOR TESTING PURPOSES *** COMMENT OUT WHEN RUNNING PROGRAM ***
}

function isBalanced(state) { // returns true if balanced, false if isn't 
    //MIGHT BE BETTER TO STORE LEFT AND RIGHT SUMS AS NODE VARIABLES TO SPEED IT UP (A LOT LESS LOOPS)
    let leftSum = 0
    let rightSum = 0
    let topRowEmpty = true
    for (let column = 0; column < 12; column++) {
        let row = 0
        while (row < 9 && state[row][column].deadSpace == 1)
            row++
        
        while (row < 9 && state[row][column].container !== null) {
            if (column < 6)
                leftSum += state[row][column].container.weight
            else 
                rightSum += state[row][column].container.weight
            
            if (row == 8) topRowEmpty = false

            row++
        }
    }

    // NEED TO CHECK THAT THERE ARE NO CONTAINERS IN 9TH ROW


    let isBalanced = (Math.min(leftSum, rightSum) / Math.max(leftSum, rightSum)) >= 0.9
    
    // Balanced if ((lighter side / heavier side) >= 0.9 OR ship is empty) AND top row is empty
    if ((isBalanced || leftSum + rightSum == 0) && topRowEmpty) {
        console.log("Balanced State:")
        consolePrintState(state)
        //console.log(state)
        return true
    }
    else return false
}

function balanceIsPossible(state) { // returns true if possible to balance, false if impossible
    let weights = []

    let leftSum = 0
    let rightSum = 0
    for (let column = 0; column < 12; column++) {
        let row = 0
        while (row < 9 && state[row][column].deadSpace == 1)
            row++
        
        while (row < 9 && state[row][column].container !== null) {
            if (column < 6)
                leftSum += state[row][column].container.weight
            else 
                rightSum += state[row][column].container.weight

            weights.push(state[row][column].container.weight)
            row++
        }
    }

    weights.sort(function(a, b) { // sorts weights from largest to smallest
        return b - a
    })

    let idealSum = (leftSum + rightSum) / 2
    let lowerBound = idealSum * (18 / 19) // 18/19 ≈ 0.95
    let upperBound = idealSum * (20 / 19) // 20/19 ≈ 1.05

    // console.log("Ideal sum: " + idealSum)
    // console.log("Lower bound: " + lowerBound)
    // console.log("Upper bound: " + upperBound)
    
    let sum = 0
    return balanceIsPossibleHelper(lowerBound, upperBound, sum, weights)
}

function balanceIsPossibleHelper(lower, upper, sum, weights) { // recursivly checks all possible weight combinations
    if (weights.length > 0 && sum < upper) {
        let weightsCopy = structuredClone(weights)
        let weight = weightsCopy.shift() // picks the heaviest weight and removes it

        sum += weight
        if (sum >= lower && sum <= upper) { // checks if the current sum is within 10% of ideal sum (NEED TO DOUBLE CHECK [> vs >=]/[< vs <=])
            //console.log("BALANCE FOUND! Possible sum: " + sum)
            return true // current sum balances the ship! Returns true and stops looking
        } else {
            return balanceIsPossibleHelper(lower, upper, sum, weightsCopy) || // keep weight and continue looking
                   balanceIsPossibleHelper(lower, upper, sum - weight, weightsCopy) // skip weight and continue looking
        }
    }
    return false
}

function balanceSearch(state) { // returns instructions for fastest balance
    let initialNode = new Node(state)
	// Create a data structure to store the paths that are being explored
	let frontier = [initialNode]

	// Create an array to store all found states by a state ID
    // A 1 at the index of state ID means the state has been found, a 0 means it hasn't
    // This is to avoid exploring paths that have already been explored
    var foundStates = new Array(9999999).fill(null) // ***TESTING STATE ID ARRAY*** 
    // need array size to be 350996490 to handle maximum ship weight (full of containers weighing 99999)
    // size greater than 9999999 takes too long to initialize to all 0's

    // change this state to found so that it won't be explored anymore

    //foundStates[getStateID(state)] = [state] // ***UNCOMMENT TO RUN FASTER BUT LESS ACCURATE UNIFORM COST***

    // While there are paths being explored
    while (frontier.length > 0) {
        // Sort the paths in the frontier by total cost (path + heuristic cost), with the lowest-cost paths first
        frontier.sort(function(a, b) {
            return (a.pathCost + a.heuristicCost) - (b.pathCost + b.heuristicCost)
        })

        // Choose the lowest-cost path from the frontier
        let node = frontier.shift() // TAKES TOO LONG WHEN FRONTIER IS HUGE

        // ***COMMENT OUT BELOW TO RUN FASTER BUT LESS ACCURATE UNIFORM COST***
        let stateID = getStateID(node.state)
        if (foundStates[stateID] === null) 
            foundStates[stateID] = [node.state] // create a new array if stateID is new
        else 
            foundStates[stateID].push(node.state) // add to the existing array if stateID is old

        // If this node reaches the goal, return the node 
        if (isBalanced(node.state)) {
            console.log("SUCCESS! Balance Instructions:")

            return getInstructions(node)
        }

        frontier = expand(frontier, foundStates, node) // ***TESTING STATE ID***
    }

    // If there are no paths left to explore, return null to indicate that the goal cannot be reached
    console.log("ERROR: No Balance found!")
    return null //Should never reach here
}

function expand(frontier, foundStates, node) { // branching function, max 12x11 branches
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
                        let tempStateID = getStateID(tempState) // ***TESTING STATE ID***

                        // *** COMMENTED OUT BECAUSE DIDN'T IMPROVE SEARCH TIME (FOR UNIFORM COST) ***
                        // If the stateID has already been generated, checks if the state has actually been found
                        // let isNewState = true
                        // if (foundStates[tempStateID] !== null) {
                        //     //console.log(foundStates[tempStateID])
                        //     for (let i = 0; i < foundStates[tempStateID].length; i++)
                        //         if (compareStates(tempState, foundStates[tempStateID][i]))
                        //             isNewState = false
                        // }
                        
                        // If this state has not been explored/found
                        if (foundStates[tempStateID] === null) {
                        //if (isNewState) {
                            let tempNode = new Node(tempState)
                            tempNode.pathCost = node.pathCost + getPathCost(node, move)
                            //tempNode.heuristicCost = getHeuristicCost(tempState)              // *** REMOVE BEFORE FLIGHT ***
                            tempNode.move = move
                            tempNode.parent = node

                            // Add the step to the frontier, using the cost and the heuristic function to estimate the total cost to reach the goal
                            frontier.push(tempNode)

                            // Mark the state as found

                            // ***UNCOMMENT BELOW FOR FASTER BUT LESS ACCURATE UNIFORM COST***
                            // if (foundStates[tempStateID] === null)
                            //     foundStates[tempStateID] = [tempState]
                            // else 
                            //     foundStates[tempStateID].push(tempState)
                        } else {
                            //console.log("DID NOT EXPAND NODE")
                        }
                    }
                }
            }
        }
    }
    return frontier
}

// Should use state ID as index instead
function getStateID(state) { // returns (almost) unique ID for each state
    //return 1
    //console.log("ENTERING")
    //consolePrintState(state)
    let id = 0
    for (let column = 0; column < 12; column++) {
        let row = 0
        while (row < 9 && state[row][column].deadSpace == 1)
            row++
        
        while (row < 9 && state[row][column].container !== null) {
            // NEED TO FIND UNIQUE COMBINATION FOR EACH POSSIBLE STATE (test when all containers have weight 1)
            //id += state[row][column].container.weight * (row + 1) * (column + 1) // fastest but least accurate

            id += state[row][column].container.weight * Math.pow(10, row) * (row + 1) * (column + 1) // slower but accurate

            //id += state[row][column].container.weight * Math.pow(10, row) * (row + 1) * (column + 1) // not accurate
            //id += state[row][column].container.weight * ((row + 1) * (column + 1) + row + column) // not accurate
            //id += (state[row][column].container.weight + (row * 10)) * ((row + 1) * (column + 1) + row + column) // even slower but accurate
            //id += (state[row][column].container.weight + (row + 1) * (10 * (column + 1))) * ((row + 1) * (column + 1) + row + column) // // slowest but accurate
            row++
        }
    }

    //console.log("ID: " + id)
    return id % 9999999
}

// REPLACED BY STATE IDs (USE TO HANDLE COLLISIONS)
/*
function compareStates(state1, state2) {// returns true if the states are the same, false otherwise
    //console.log("HELLO")
    for (let column = 0; column < 12; column++) {
        let row = 0
        while (row < 9 && (state1[row][column].deadSpace == 1 || state2[row][column].deadSpace == 1)) {
            if (state1[row][column].deadSpace != state2[row][column].deadSpace)
                return false

            row++
        }
        
        while (row < 9 && (state1[row][column].container !== null || state2[row][column].container !== null)) {
            if (state1[row][column].container == null || state2[row][column].container == null)
                return false
            
            if (state1[row][column].container.weight != state2[row][column].container.weight)
                return false

            row++
        }
    }

    //console.log("SAME STATES:")
    // consolePrintState(state1)
    // consolePrintState(state2)

    return true
}
*/

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

    // first initializes values to calculate cost moving crane to position
    let maxMoveHeight = Math.max(node.move[NEW][ROW], move[OLD][ROW])
    let left = Math.min(node.move[NEW][COLUMN], move[OLD][COLUMN])
    let right = Math.max(node.move[NEW][COLUMN], move[OLD][COLUMN])
    
    for (let i = 0; i < 2; i++) {
        // add Manhattan Distance to cost
        if (i == 0) { // First will add cost to move crane to old container location
            cost += Math.abs(node.move[NEW][ROW] - move[OLD][ROW]) // add vertical crane distance to cost
            cost += Math.abs(node.move[NEW][COLUMN] - move[OLD][COLUMN]) // add horizontal crane distance to cost 
        } 
        else { // Then will add actual cost of move
            cost += Math.abs(move[NEW][ROW] - move[OLD][ROW]) // add vertical distance to cost
            cost += Math.abs(move[NEW][COLUMN] - move[OLD][COLUMN]) // add horizontal distance to cost

            maxMoveHeight = Math.max(move[NEW][ROW], move[OLD][ROW])
            left = Math.min(move[NEW][COLUMN], move[OLD][COLUMN])
            right = Math.max(move[NEW][COLUMN], move[OLD][COLUMN])
        }

        // add any additional cost caused by containers blocking path
        let maxObstacleHeight = maxMoveHeight    
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
    }
    return cost
}

function getHeuristicCost(state) { // returns true if possible to balance, false if impossible
    let containers = []

    let leftSum = 0
    let rightSum = 0
    for (let column = 0; column < 12; column++) {
        let row = 0
        while (row < 9 && state[row][column].deadSpace == 1)
            row++
        
        while (row < 9 && state[row][column].container !== null) {
            if (column < 6)
                leftSum += state[row][column].container.weight
            else 
                rightSum += state[row][column].container.weight

            containers.push(state[row][column].container)
            row++
        }
    }

    containers.sort(function(a, b) { // sorts weights from largest to smallest
        return b.weight - a.weight
    })

    let idealSum = (leftSum + rightSum) / 2
    // let lowerDeficit = idealSum * (18 / 19) - Math.min(leftSum, rightSum) // 18/19 ≈ 0.95
    // let upperDeficit = idealSum * (20 / 19) - Math.min(leftSum, rightSum) // 20/19 ≈ 1.05
    let lowerBound = idealSum * (18 / 19) // 18/19 ≈ 0.95
    let upperBound = idealSum * (20 / 19) // 20/19 ≈ 1.05
    
    console.log("Ideal sum: " + idealSum)
    console.log("Lower bound: " + lowerBound)
    console.log("Upper bound: " + upperBound)
    
    let sum = 0
    let combination = []
    let balancedCombinations = []
    // NEED TO SEARCH DIAGONALLY DOWN FROM MIDDLE
    // SORT BY MANHATTAN DISTANCE TO CLOSEST AVILABLE CELL ON OTHER SIDE
    
    let cost = getHeuristicCostHelper(lowerBound, upperBound, sum, containers, combination, balancedCombinations)
    console.log(balancedCombinations.length)
    return cost

    // *old* WILL ADD CRANE COST TO MANHATTAN DISTANCE, AND *2 ALL EXCEPT BIGGEST


    //balancedCombinations.forEach((e) => console.log(e))


    
    // add Manhattan Distance to cost
    
    // // Then will add actual cost of move
    // cost += Math.abs(move[NEW][ROW] - move[OLD][ROW]) // add vertical distance to cost
    // cost += Math.abs(move[NEW][COLUMN] - move[OLD][COLUMN]) // add horizontal distance to cost
    
    // let maxMoveHeight = Math.max(move[NEW][ROW], move[OLD][ROW])
    // let left = Math.min(move[NEW][COLUMN], move[OLD][COLUMN])
    // let right = Math.max(move[NEW][COLUMN], move[OLD][COLUMN])
    
    // // add any additional cost caused by containers blocking path
    // let maxObstacleHeight = maxMoveHeight    
    // for (let column = left + 1; column < right; column++) { // for all columns between old and new locations
    //     let row = 0
    //     while (row < 9 && node.state[row][column].deadSpace == 1)
    //         row++
    
    //     while (row < 9 && node.state[row][column].container !== null)
    //         row++
    
    //     if (row > maxObstacleHeight)
    //         maxObstacleHeight = row
    // }
    // cost += 2 * (maxObstacleHeight - maxMoveHeight) // what goes up must come down
    
}

// fills "balancedCombinations" with all possible container combinations that balance the ship
function getHeuristicCostHelper(lower, upper, sum, containers, combination, balancedCombinations) { // recursivly checks all possible weight combinations
    if (containers.length > 0 && sum < upper) {
        let containersCopy = structuredClone(containers)
        let container = containersCopy.shift() // picks the heaviest container and removes it
        let weight = container.weight

        let newCombination = structuredClone(combination)
        newCombination.push(container)
        let oldCombination = structuredClone(combination)

        sum += weight
        if (sum > lower && sum < upper) { // checks if the current sum is within 10% of ideal sum (NEED TO DOUBLE CHECK [> vs >=]/[< vs <=])
            //console.log("Checking: " + sum + " SUCCESS " + containersCopy.length)
            balancedCombinations.push(newCombination)
            //return true // ***REMOVE RETURN***
            
            //Uncomment line below to get all combinations,
            //Leave commented to only get combinations in order of how they're sorted
            //Needs to be commented if selecting going off manhattan distance
            getHeuristicCostHelper(lower, upper, sum - weight, containersCopy, oldCombination, balancedCombinations) // skip weight and continue looking
        } else {
           // console.log("Checking: " + sum + " FAIL " + containersCopy.length)
           getHeuristicCostHelper(lower, upper, sum, containersCopy, newCombination, balancedCombinations) // keep weight and continue looking
           getHeuristicCostHelper(lower, upper, sum - weight, containersCopy, oldCombination, balancedCombinations) // skip weight and continue looking
        }

        // NEED TO CHECK HEURISTIC COST SO FAR IS LOWER THAN LOWEST FOUND BEFORE CALLING RECURSIVE
        // WILL BE INITIALLY 0, THEN BE UPDATED TO VALUE ONCE BALANCE IS FOUND
        // UPDATED VALUE WILL BE SMALLEST COST OF MOVING COMBINATION LEFT TO RIGHT, OR RIGHT TO LEFT (CAN'T BE ZERO)
        // HAS TO CONTAIN CRANE COST AS WELL
        // EACH COMBINATION WILL HAVE A COST SO FAR
        // ***old*** IF NONZERO AND SUM OF MANHATTAN DISTANCES TO CLOSEST CELL SO FAR GOES OVER OR EQUAL, IT WON'T CONTINUE WITH THAT BRANCH
        // WON'T START NEW BRANCH IF SMALLEST MANHATTAN DISTANCE CONTAINER IN COMBINATION IS BIGGER OR EQUAL THAN VALUE
    }
    //return false
}

function heuristicCost(combination, move) {
    let cost = 0
    return cost
}

function performSIFT(state) { // return instructions for SIFT
    return []
}

// Everything below is for returning the instructions only

function getInstructions(node) { // Calls recursive function to return all steps
    var instructions = []
	instructions = getInstructionsHelper(node, 0, instructions)

    let buffer = new Array(4).fill(new Array(24).fill({container: null, deadSpace: 0})) // 4x24 array of empty cells
    let state = {ship: node.state, buffer: buffer, truck: 0}

    instructions.push({cost: 0, state: state, initialPos: {pos: node.move[1], loc: 1}, finalPos: {pos: node.move[1], loc: 1}})

    //return {cost: node.pathCost, steps: instructions}
    return instructions
}

function getInstructionsHelper(node, cost, instructions) { // Recursively returns instructions in order
    cost += node.pathCost - node.parent.pathCost

    // Retruns steps in order but not the very first redundant one (used to store intial crane position)
    if (node.parent != null && node.parent.parent != null)
        getInstructionsHelper(node.parent, cost, instructions)
    
    //instructions.push(node.move)
    //instructions.push({stepCost: (node.pathCost - node.parent.pathCost), stepState: node.state, step: node.move})

    let buffer = new Array(4).fill(new Array(24).fill({container: null, deadSpace: 0})) // 4x24 array of empty cells
    let state = {ship: node.parent.state, buffer: buffer, truck: 0}

    instructions.push({cost: cost, state: state, initialPos: {pos: node.move[0], loc: 1}, finalPos: {pos: node.move[1], loc: 1}})

    return instructions
}