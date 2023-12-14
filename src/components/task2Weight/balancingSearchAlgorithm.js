import React, { useEffect, useState, Component } from 'react';
import '../../css/tasks.css'

// EDGAR'S CODE ABOVE

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

// This function is strictly for debugging
function consolePrintStateMap(stateMap) {
    for (let row = 8; row >= 0; row--) {
        let a = []
        a.push(row + 1)
        for (let column = 0; column < 12; column++) {
            a.push(stateMap[row][column])
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




// ***************************************************************************************************************************************************************
// ***************************************************************************************************************************************************************


// Algorithm's code starts below


class Node {
	constructor(ship) {
		this.state = structuredClone(ship) // should make a copy of "ship" grid array
		this.pathCost = 0 // total path cost (actual cost in minutes to get to current state)
		this.heuristicCost = 0 // estimated cost in minutes left to reach balance
        // ((old row, old column), (new row, new column))
		this.move = [[8,0],[8,0]] // initial crane position
		this.parent = null

        this.stateMap = [] // only used to speed up balancing heuristic
	}
}

const OLD = 0
const NEW = 1
const ROW = 0
const COLUMN = 1

async function balance(ship) {  // returns instructions to balance, already balanced returns empty instructions  
    console.log("Initial State:")
    //console.log(ship);
    consolePrintState(ship)

    console.log("HEURISTIC COST: " + getHeuristicCost(ship, [8,0], initializeStateMap(ship)))
    console.log("CHECKING BALANCE...")

    if (balanceIsPossible(ship)) { // if balance is possible, searches for a balance and returns the instructions
        if (isBalanced(ship))
            console.log("ALREADY BALANCED")
        else
            console.log("UNBALANCED & BALANCE POSSIBLE, BALANCING...")

        return balanceSearch(ship) 
    } 
    else { // if balance is impossible, searches for a SIFT and returns the instructions
        if (isSIFTed(ship))
            console.log("UNBALANCED & IMPOSSIBLE TO BALANCE, ALREADY SIFTED")
        else
            console.log("UNBALANCED & IMPOSSIBLE TO BALANCE, SIFTING...")

        return performSIFT(ship)
    }

    return performSIFT(ship) // FOR TESTING ONLY
}

function isBalanced(state) { // returns true if balanced, false if isn't 
    //MIGHT BE BETTER TO STORE LEFT AND RIGHT SUMS AS NODE VARIABLES TO SPEED IT UP (A LOT LESS LOOPS)
    let leftSum = 0
    let rightSum = 0
    let topRowEmpty = true
    for (let column = 0; column < 12; column++) {
        let row = 0
        while (row < 8 && state[row][column].deadSpace == 1)
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

    let isBalanced = (Math.min(leftSum, rightSum) / Math.max(leftSum, rightSum)) >= 0.9
    
    // Balanced if ((lighter side / heavier side) >= 0.9 OR ship is empty) AND top row is empty
    if ((isBalanced || leftSum + rightSum == 0) && topRowEmpty) {
        // console.log("Balanced State:")
        // consolePrintState(state)
        //console.log(state)
        return true
    }
    else return false
}

function balanceIsPossible(state) { // returns true if possible to balance, false if impossible
    let weights = getWeightsSortedHeaviestToLightest(state)

    let sum = 0
    weights.forEach(weight => {
        sum += weight
    })

    let idealSum = sum / 2
    let lowerBound = idealSum * (18 / 19) // 18/19 ≈ 0.95
    let upperBound = idealSum * (20 / 19) // 20/19 ≈ 1.05

    // console.log("Ideal sum: " + idealSum)
    // console.log("Lower bound: " + lowerBound)
    // console.log("Upper bound: " + upperBound)
    
    return balanceIsPossibleHelper(lowerBound, upperBound, 0, sum, weights)
}

function balanceIsPossibleHelper(lower, upper, sum, weightRemaining, weights) { // recursivly checks all possible weight combinations
    if (weights.length > 0 && sum < upper) {
        let weightsCopy = structuredClone(weights)
        let weight = weightsCopy.shift() // picks the heaviest weight and removes it

        sum += weight
        weightRemaining -= weight
        if (sum >= lower && sum <= upper) { // checks if the current sum is within 10% of ideal sum (NEED TO DOUBLE CHECK [> vs >=]/[< vs <=])
            //console.log("BALANCE FOUND! Possible sum: " + sum)
            return true // current sum balances the ship! Returns true and stops looking
        } else if (sum + weightRemaining > lower) {
            return balanceIsPossibleHelper(lower, upper, sum, weightRemaining, weightsCopy) || // keep weight and continue looking
                   balanceIsPossibleHelper(lower, upper, sum - weight, weightRemaining, weightsCopy) // skip weight and continue looking
        }
    }
    return false
}




// ***************************************************************************************************************************************************************
// ***************************************************************************************************************************************************************


// Balance search starts below
// This is for when balancing is POSSIBLE


function balanceSearch(state) { // returns instructions for fastest balance
    let initialNode = new Node(state)
    initialNode.stateMap = initializeStateMap(state) // only used to speed up balancing heuristic

	// Create a data structure to store the paths that are being explored
	let frontier = [initialNode]

	// Create an array to store all found states by a state ID
    // A 1 at the index of state ID means the state has been found, a 0 means it hasn't
    // This is to avoid exploring paths that have already been explored
    var foundStates = new Array(10000000).fill(null) // ***TESTING STATE ID ARRAY*** 
    // need array size to be 350996490 to handle maximum ship weight (full of containers weighing 99999)
    // size greater than 9999999 takes too long to initialize to all 0's

    // change this state to found so that it won't be explored anymore

    foundStates[getStateID(state)] = [state] // ***UNCOMMENT TO RUN FASTER BUT LESS ACCURATE UNIFORM COST*** 

    // While there are paths being explored
    while (frontier.length > 0) {
        // Sort the paths in the frontier by total cost (path + heuristic cost), with the lowest-cost paths first
        frontier.sort(function(a, b) {
            return (a.pathCost + a.heuristicCost) - (b.pathCost + b.heuristicCost)
        })

        // Choose the lowest-cost path from the frontier
        let node = frontier.shift() // TAKES TOO LONG WHEN FRONTIER IS HUGE

        // ***COMMENT OUT BELOW TO RUN FASTER BUT LESS ACCURATE UNIFORM COST*** 
        // let stateID = getStateID(node.state)
        // if (foundStates[stateID] === null) 
        //     foundStates[stateID] = [node.state] // create a new array if stateID is new
        // else 
        //     foundStates[stateID].push(node.state) // add to the existing array if stateID is old

        // If this node reaches the goal, return the node 
        if (isBalanced(node.state)) {
        //if (node.heuristicCost == 0) {
            console.log("SUCCESS!")
            console.log("Balanced State:")
            consolePrintState(node.state)

            // frontier.forEach(node => {
            //     consolePrintState(node.state)
            //     console.log("CRANE POS: " + node.move[NEW])
            //     console.log("HEURISTIC COST: " + getHeuristicCost(node.state, [8,0]))
            // })

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
                        let tempStateMap = getNewStateMap(node.stateMap, move) // only used to speed up balancing heuristic
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
                            tempNode.pathCost = node.pathCost + getPathCost(node.state, node.move[NEW], move) // sends old state, old crane position, and new move as inputs
                            tempNode.heuristicCost = getHeuristicCost(tempState, node.move[NEW], tempStateMap) // sends new state and old crane position as inputs
                            tempNode.move = move
                            tempNode.parent = node

                            tempNode.stateMap = tempStateMap // only used to speed up balancing heuristic

                            // Add the step to the frontier, using the cost and the heuristic function to estimate the total cost to reach the goal
                            frontier.push(tempNode)

                            // Mark the state as found

                            // ***UNCOMMENT BELOW FOR FASTER BUT LESS ACCURATE UNIFORM COST*** 
                            if (foundStates[tempStateID] === null)
                                foundStates[tempStateID] = [tempState]
                            else 
                                foundStates[tempStateID].push(tempState)
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
        while (row < 8 && state[row][column].deadSpace == 1)
            row++
        
        while (row < 9 && state[row][column].container !== null) {
            // NEED TO FIND UNIQUE COMBINATION FOR EACH POSSIBLE STATE (test when all containers have weight 1)
            
            //id += state[row][column].container.weight * Math.pow(10, row) * (row + 1) * (column + 1) // slower but (almost) accurate
            
            //id += state[row][column].container.weight * (row + 1) * (column + 1) // fastest but not accurate
            //id += state[row][column].container.weight * Math.pow(10, row) * ((row + 1) * (column + 1) + row + column) // NEED TO TEST
            //id += state[row][column].container.weight * ((row + 1) * (column + 1) + row + column) // not accurate
            //id += (state[row][column].container.weight + (row * 10)) * ((row + 1) * (column + 1) + row + column) // even slower but not accurate

            id += (state[row][column].container.weight + (row + 1) * (10 * (column + 1))) * ((row + 1) * (column + 1) + row + column) // // slowest but accurate (NOT IF SIFT)

            //      *******************         NEED TO FIND STATE ID THAT IS ACCURATE BOTH IN BALANCING AND SIFT           **********************

            row++
        }
    }

    //console.log("ID: " + id)
    return id % 10000000
}

// Used TO HANDLE COLLISIONS in foundStates
// *************** CURRENTLY NEEDED FOR SIFTING TO WORK (not needed for balancing) ********************
///*
function compareStates(state1, state2) {// returns true if the states are the same, false otherwise
    //console.log("HELLO")
    for (let column = 0; column < 12; column++) {
        let row = 0
        while (row < 8 && (state1[row][column].deadSpace == 1 || state2[row][column].deadSpace == 1)) {
            if (state1[row][column].deadSpace != state2[row][column].deadSpace) // if one state has a different NAN than the other
                return false

            row++
        }
        
        while (row < 9 && (state1[row][column].container !== null || state2[row][column].container !== null)) {
            if (state1[row][column].container == null || state2[row][column].container == null) // if one state is missing a container the other has
                return false
            
            if (state1[row][column].container.weight != state2[row][column].container.weight) // if one state has a different container than the other
                return false

            row++
        }
    }

    //console.log("SAME STATES:")
    // consolePrintState(state1)
    // consolePrintState(state2)

    return true
}
//*/

function getMove(state, oldColumn, newColumn) { // returns empty array if move is invalid
    // first check if it possible to move from oldCoumn to newColumn
    let column = Math.min(oldColumn + 1, newColumn + 1)
    while (column < Math.max(oldColumn, newColumn)) {
        if (state[8][column].deadSpace == 1 || state[8][column].container !== null) // returns invalid if impossible to move from oldColumn to newColumn
            return []

        column++
    }

    // next check if there is a container in oldColumn
    let oldRow = 0
    while (oldRow < 8 && state[oldRow][oldColumn].deadSpace == 1)
        oldRow++
    if (state[oldRow][oldColumn].container === null) // returns invalid if no containers in oldColumn
        return []

    while (oldRow < 8 && state[oldRow + 1][oldColumn].container !== null) // finds top container row in old column
        oldRow++ // increment if container on top of cell

    let newRow = 0
    while (newRow < 8 && (state[newRow][newColumn].container !== null || state[newRow][newColumn].deadSpace == 1)) // finds top empty cell in new column
        newRow++ // getMove assumes there is a empty cell on top of newColumn, else getMove isn't called

    return [[oldRow, oldColumn], [newRow, newColumn]] // the move is returned               
}

function getNewState(oldState, move) {
    var newState = structuredClone(oldState)
    newState[move[OLD][ROW]][move[OLD][COLUMN]] = {container: null, deadSpace: false} // replace old location with empty cell
    newState[move[NEW][ROW]][move[NEW][COLUMN]] = oldState[move[OLD][ROW]][move[OLD][COLUMN]] // container is now in new cell    
    return newState
}

function initializeStateMap(state) { // only used to speed up balancing heuristic
    let stateMap = structuredClone(state)
    
    // gives each container its unique id
    for (let row = 0; row < 9; row++)
        for (let column = 0; column < 12; column++)
            if (state[row][column].container !== null)
                stateMap[row][column] = row * 100 + column
            else
            stateMap[row][column] = -1

    return stateMap
}

function getNewStateMap(oldStateMap, move) { // only used to speed up balancing heuristic
    var newStateMap = structuredClone(oldStateMap)
    newStateMap[move[OLD][ROW]][move[OLD][COLUMN]] = -1 // replace old location with empty cell
    newStateMap[move[NEW][ROW]][move[NEW][COLUMN]] = oldStateMap[move[OLD][ROW]][move[OLD][COLUMN]] // container is now in new cell    
    return newStateMap
}

function getPathCost(state, cranePos, move) { // returns the path cost (minutes) to get to the state
    let cost = 0

    // first initializes values to calculate cost moving crane to position
    let maxMoveHeight = Math.max(cranePos[ROW], move[OLD][ROW])
    let left = Math.min(cranePos[COLUMN], move[OLD][COLUMN])
    let right = Math.max(cranePos[COLUMN], move[OLD][COLUMN])
    
    for (let i = 0; i < 2; i++) { // first crane cost, then move cost
        // add Manhattan Distance to cost
        if (i == 0) { // First will add cost to move crane to old container location
            cost += Math.abs(cranePos[ROW] - move[OLD][ROW]) // add vertical crane distance to cost
            cost += Math.abs(cranePos[COLUMN] - move[OLD][COLUMN]) // add horizontal crane distance to cost 
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
            while (row < 8 && state[row][column].deadSpace == 1)
                row++
            
            while (row < 8 && state[row][column].container !== null) // assumes no containers in top row between move columns
                row++
            
            if (row > maxObstacleHeight)
                maxObstacleHeight = row
        }
        cost += 2 * (maxObstacleHeight - maxMoveHeight) // what goes up must come down
    }

    return cost
}

let everyBalancingCombination = [] // stores all the minimal balancing combinations in the ship (i.e. if {5,4} and {5,4,1} both balance, then only keep {5,4})
// This is so that recursion is only run the first time the heuristic is called

function getHeuristicCost(state, cranePos, stateMap) { // returns estimated cost to balance ship from current state (tries to get as close to the actual cost without going over)
    if (isBalanced(state)) // heuristic cost is 0 if already balanced
        return 0
    
    let containers = []
    let leftAvailableEmptyCells = []
    let rightAvailableEmptyCells = []

    for (let i = 0; i < 6; i++) { // adds all containers into array in order starting from middle and going outwards, top to down
        let topLeftEmptyRow = 9 // initially out of bounds
        let topRightEmptyRow = 9 // initially out of bounds
        for (let row = 8; row >= 0; row--) {
            let column = 5 - i // left side
            if (state[row][column].deadSpace == 0) {
                if (state[row][column].container == null)
                    topLeftEmptyRow--
                else
                    containers.push({id: stateMap[row][column], weight: state[row][column].container.weight, pos: [row, column], moveCost: 0, craneCost: 0})
            }// moveCost is min cost to move to other side, craneCost is min cost to move crane to it

            column = 6 + i // right side
            if (state[row][column].deadSpace == 0) {
                if (state[row][column].container == null)
                    topRightEmptyRow--
                else
                    containers.push({id: stateMap[row][column], weight: state[row][column].container.weight, pos: [row, column], moveCost: 0, craneCost: 0})
            }// moveCost is min cost to move to other side, craneCost is min cost to move crane to it
        }
        if (topLeftEmptyRow < 9)
            leftAvailableEmptyCells.push([topLeftEmptyRow, 5 - i])

        if (topRightEmptyRow < 9)
            rightAvailableEmptyCells.push([topRightEmptyRow, 6 + i])
    }

    let sum = 0
    containers.forEach(container => { // update moveCost and craneCost to actual values
        // craneCost is manhattan distance of crane position to container position
        container.craneCost = Math.abs(cranePos[ROW] - container.pos[ROW]) // add vertical distance to cost
        container.craneCost += Math.abs(cranePos[COLUMN] - container.pos[COLUMN]) // add horizontal distance to cost

        // moveCost is manhattan distance of container position to closest empty position
        let minMoveCost = Number.POSITIVE_INFINITY
        if (container.pos[COLUMN] < 6) { // container on left side
            rightAvailableEmptyCells.forEach(emptyPos => {
                let moveCost = Math.abs(emptyPos[ROW] - container.pos[ROW]) // add vertical distance to cost
                moveCost += Math.abs(emptyPos[COLUMN] - container.pos[COLUMN]) // add horizontal distance to cost
                
                if (moveCost < minMoveCost)
                    minMoveCost = moveCost
            });
        } else { // container on right side
            leftAvailableEmptyCells.forEach(emptyPos => {
                let moveCost = Math.abs(emptyPos[ROW] - container.pos[ROW]) // add vertical distance to cost
                moveCost += Math.abs(emptyPos[COLUMN] - container.pos[COLUMN]) // add horizontal distance to cost
                
                if (moveCost < minMoveCost)
                    minMoveCost = moveCost
            });
        }
        container.moveCost = minMoveCost

        sum += container.weight
    });

    // console.log("containers:")
    // console.log(containers)
    // console.log("left empty:")
    // console.log(leftAvailableEmptyCells)
    // console.log("right empty:")
    // console.log(rightAvailableEmptyCells)

    let idealSum = sum / 2 
    let lowerBound = idealSum * (18 / 19) // 18/19 ≈ 0.95
    let upperBound = idealSum * (20 / 19) // 20/19 ≈ 1.05
    
    // console.log("Ideal sum: " + idealSum)
    // console.log("Lower bound: " + lowerBound)
    // console.log("Upper bound: " + upperBound)

    let cost = Number.POSITIVE_INFINITY
    if (everyBalancingCombination.length == 0) { // This is only run the first time the heuristic is called (Only runs recursion once)
        let combination = []
        let balancedCombinations = []
        
        cost = getHeuristicCostHelper(lowerBound, upperBound, 0, containers, combination, balancedCombinations, Number.POSITIVE_INFINITY, containers, sum)
        //console.log(balancedCombinations)

        // need combinations to only have the minimum number of containers needed to balance
        // NEED TO TEST IF MINIMUM MATTERS
        let balancedCombinationsCopy = structuredClone(balancedCombinations)
        //console.log(balancedCombinationsCopy)

        // minimizes the balancing combinations in the ship (i.e. if {5,4} and {5,4,1} both balance, then only keep {5,4})
        for (let small = 0; small < balancedCombinations.length; small++) {
            for (let big = 0; big < balancedCombinations.length; big++) {
                if (balancedCombinations[big].length > balancedCombinations[small].length) {
                    let shareAllContainers = true
                    let s = 0
                    while (shareAllContainers && s < balancedCombinations[small].length) {
                        let b = 0
                        // look to see if bigger combination has the smaller combination's container at index s
                        while (b < balancedCombinations[big].length && (balancedCombinations[small][s].pos[ROW] != balancedCombinations[big][b].pos[ROW] || balancedCombinations[small][s].pos[COLUMN] != balancedCombinations[big][b].pos[COLUMN])) {
                            b++
                        }
                        if (b == balancedCombinations[big].length) 
                            shareAllContainers = false // if the bigger combination did not have the smaller combination's container at index s, they do not share all the containers (in smaller combination)
                        s++
                    }

                    if (shareAllContainers) { // If they share all the containers (in smaller combination), then the bigger combination is the exact same comination as the smaller with just added containers
                        //console.log(balancedCombinations[big])
                        balancedCombinations[big] = []
                    }
                }
            }
        }

        // stores the minimum balancing combinations
        balancedCombinations.forEach(combination => {
            if (combination.length > 0)
                everyBalancingCombination.push(combination)
        }) 
        console.log("Minimizing number of combinations: " + balancedCombinations.length + " -> " + everyBalancingCombination.length)
    } 
    else { // This is run every other time
        let balancedCombinations = structuredClone(everyBalancingCombination)
        
        // need to first update combination to correct values
        for (let i = 0; i < balancedCombinations.length; i++) {
            for (let j = 0; j < balancedCombinations[i].length; j++) {
                containers.forEach((container, index) => {
                    if (balancedCombinations[i][j].id == container.id)
                        balancedCombinations[i][j] = container
                })
            }
        }

        //console.log(balancedCombinations)

        // then return minimum cost
        balancedCombinations.forEach(combination => {
            let tempCost = totalMovingCost(combination, lowerBound, upperBound, containers)
            if (tempCost < cost)
                cost = tempCost
        })
    }

    return cost
}

// fills "balancedCombinations" with all possible container combinations that balance the ship
// can remove sum variable by having it recomputed each time
function getHeuristicCostHelper(lower, upper, sum, containers, combination, balancedCombinations, cost, originalContainers, weightRemaining) { // recursivly checks all possible weight combinations
    //console.log("RECURSION")
    if (containers.length > 0 && sum < upper) {
        let containersCopy = structuredClone(containers)
        let container = containersCopy.shift() // picks the heaviest container and removes it
        let weight = container.weight

        let oldCombination = structuredClone(combination)

        sum += weight
        weightRemaining -= weight
        if (sum > upper) // skip weight and continue looking if weight is too heavy too balance
            return getHeuristicCostHelper(lower, upper, sum - weight, containersCopy, oldCombination, balancedCombinations, cost, originalContainers, weightRemaining)
        else if (sum + weightRemaining < lower)
            return cost
        
        let newCombination = structuredClone(combination)
        newCombination.push(container)



        // WANT TO CHECK BALANCED COMBINATIONS HERE TO AVOID REPEATING COMBINATIONS WHERE CONTAINERS ARE ALL ON THE SAME SIDE
        //if (balancedCombinations.length > 0) return cost


        let tempCost = totalMovingCost(newCombination, lower, upper, originalContainers)


        if (tempCost >= cost) // ADDED EXTRA COMPARISON HERE TO STOP RECURSION EARLIER            ** NOT SURE IF I SHOULD INCLUDE BALANCED COMBINATIONS THAT HAVE HIGH COST IN HEURISTIC ** EDIT: I DO NEED THEM ALL
            return cost // stop searching if combination already went over the lowest cost

        if (sum >= lower && sum <= upper) { // checks if the current sum is within 10% of ideal sum (NEED TO DOUBLE CHECK [> vs >=]/[< vs <=])
            let nextCost = getHeuristicCostHelper(lower, upper, sum - weight, containersCopy, oldCombination, balancedCombinations, tempCost, originalContainers, weightRemaining) // skip weight and continue looking

            //if (tempCost <= nextCost) console.log(newCombination)
            balancedCombinations.push(newCombination)

            //return tempCost // NOT ACCURATE
            return Math.min(tempCost, nextCost)
        } else if (sum < lower) {
            // console.log("Checking: " + sum + " FAIL " + containersCopy.length)
            let keepCost = getHeuristicCostHelper(lower, upper, sum, containersCopy, newCombination, balancedCombinations, cost, originalContainers, weightRemaining) // keep weight and continue looking
            let skipCost = getHeuristicCostHelper(lower, upper, sum - weight, containersCopy, oldCombination, balancedCombinations, cost, originalContainers, weightRemaining) // skip weight and continue looking

            return Math.min(keepCost, skipCost, cost)
        }
    }

    return cost
}

/* // OLD VERSION 
// returns the cost to move all the containers in the combination to the same side (other side if already on the same side)
function totalMovingCost(combination, lower, upper, originalContainers) {
    let cost = Number.POSITIVE_INFINITY

    let leftContainers = []
    let rightContainers = []
    let maxLeftMoveCost = 0
    let maxRightMoveCost = 0

    combination.forEach(container => {
        if (container.craneCost < cost) {
            cost = container.craneCost // first add min craneCost to cost
        }

        // separates each container in combination into left and right side
        if (container.pos[COLUMN] < 6) {
            if (container.moveCost > maxLeftMoveCost)
                maxLeftMoveCost = container.moveCost

            leftContainers.push(container)
        } else {
            if (container.moveCost > maxRightMoveCost)
                maxRightMoveCost = container.moveCost

            rightContainers.push(container)
        }
    })
    
    // if all containers are on one side, return cost to move all container to other side
    if (leftContainers.length == 0 || rightContainers.length == 0) {
        combination.forEach(container => { // return cost to move all containers to other side
            if (container.moveCost == Math.max(maxLeftMoveCost, maxRightMoveCost)) {
                cost += container.moveCost
            } else {
                cost += container.moveCost * 2
            }
        })

        return cost
    }  

    // else return the min cost of moving all containers in comination to left or all containers in combination to right

    // moving all containers in combination to right
    let leftToRightCost = 0
    leftContainers.forEach(container => {
        if (container.moveCost == maxLeftMoveCost)
            leftToRightCost += container.moveCost
        else
            leftToRightCost += container.moveCost * 2
    })


    // moving all containers in combination to left
    let rightToLeftCost = 0
    rightContainers.forEach(container => {
        if (container.moveCost == maxRightMoveCost)
            rightToLeftCost += container.moveCost
        else
            rightToLeftCost += container.moveCost * 2
        //rightToLeftCost += container.moveCost
    }) 

    
    cost = Math.min(leftToRightCost, rightToLeftCost)

    return cost
}*/

// a lot more accurate
// returns the cost to move all the containers in the combination to the same side (other side if already on the same side)
function totalMovingCost(combination, lower, upper, originalContainers) {
    //console.log('GETTING TOTAL COST')
    let cost = 0
    
    let leftContainers = []
    let rightContainers = []

    let sum = 0
    
    let minCraneCost = Number.POSITIVE_INFINITY
    let firstContainerID = -1

    combination.forEach(container => {
        if (container.craneCost < minCraneCost) {
            minCraneCost = container.craneCost // first add min craneCost to cost
            firstContainerID = container.id // min craneCost is also the first move position
        }

        // separates each container in combination into left and right side
        if (container.pos[COLUMN] < 6)
            leftContainers.push(container)
        else
            rightContainers.push(container)

        sum += container.weight
    })

    let isBalanced = (sum >= lower && sum <= upper)
    
    // if all containers are on one side, return cost to move all container to other side
    if (leftContainers.length == 0 || rightContainers.length == 0) {
        // if balanced, first update cost to take into account moving all the containers not in combination
        // if balanced, add cost of moving all containers not in combination to other side
        if (isBalanced) {
            let balancedOnlyMovingLeft = leftContainers.length == 0
            let balancedOnlyMovingRight = rightContainers.length == 0

            let i = 0
            originalContainers.forEach(container => {
                if ((balancedOnlyMovingLeft && container.pos[COLUMN] < 6) || (balancedOnlyMovingRight && container.pos[COLUMN] > 5)) {
                    // check if container is part of combination
                    let notInCombination = true
                    let i = 0
                    while (i < combination.length) {
                        if (container.id == combination[i].id) {
                            notInCombination = false
                            break
                        }
                        i++
                    }

                    if (notInCombination && container.craneCost < minCraneCost) {
                        minCraneCost = container.craneCost
                        firstContainerID = container.id // min craneCost is also the first move position
                    }
                }
            })

            i = 0
            originalContainers.forEach(container => {
                // check if container is part of combination
                if ((balancedOnlyMovingLeft && container.pos[COLUMN] < 6) || (balancedOnlyMovingRight && container.pos[COLUMN] > 5)) {
                    // check if container is part of combination
                    let notInCombination = true
                    let i = 0
                    while (i < combination.length) {
                        if (container.id == combination[i].id) {
                            notInCombination = false
                            break
                        }
                        i++
                    }

                    if (notInCombination) {
                        if (container.id == firstContainerID)
                            cost += container.moveCost
                        else
                            cost += container.moveCost * 2
                    }
                } else {
                    // check that container is not part of combination and is on top of combination
                    let notInCombination = true
                    let isOnTopOfCombination = false
                    let i = 0
                    while (i < combination.length) {
                        if (container.id == combination[i].id) {
                            notInCombination = false
                            break
                        } else if (container.pos[COLUMN] == combination[i].pos[COLUMN] && container.pos[ROW] > combination[i].pos[ROW]) {
                            isOnTopOfCombination = true
                        }
                        i++
                    }

                    if (notInCombination && isOnTopOfCombination) {
                        cost += 2
                    }
                }
            })
        }

        cost += minCraneCost

        combination.forEach(container => { // return cost to move all containers to other side
            if (container.id == firstContainerID)
                cost += container.moveCost
            else
                cost += container.moveCost * 2
        })

        return cost
    }  




    // else return the min cost of moving all containers in comination to left or all containers in combination to right


    // moving all containers in combination to right
    let leftToRightCost = 0
    leftContainers.forEach(container => {
        if (container.id == firstContainerID)
            leftToRightCost += container.moveCost
        else
            leftToRightCost += container.moveCost * 2
    })

    let oldMinCraneCost = minCraneCost
    if (isBalanced) { // add cost of moving all containers not in combination to other side        
        let i = 0
        originalContainers.forEach(container => {
            // check if container is part of combination
            if (container.pos[COLUMN] > 5) {
                // check if container is part of combination
                let notInCombination = true
                let i = 0
                while (i < combination.length) {
                    if (container.id == combination[i].id) {
                        notInCombination = false
                        break
                    }
                    i++
                }

                if (notInCombination && container.craneCost < minCraneCost) {
                    minCraneCost = container.craneCost
                    firstContainerID = container.id // min craneCost is also the first move position
                }
            }
        })
        
        i = 0
        originalContainers.forEach(container => {
            // check if container is part of combination
            if (container.pos[COLUMN] > 5) {
                // check if container is part of combination
                let notInCombination = true
                let i = 0
                while (i < combination.length) {
                    if (container.id == combination[i].id) {
                        notInCombination = false
                        break
                    }
                    i++
                }

                if (notInCombination) {
                    if (container.id == firstContainerID)
                        leftToRightCost += container.moveCost
                    else
                        leftToRightCost += container.moveCost * 2
                }
            } else {
                // check that container is not part of combination and is on top of combination
                let notInCombination = true
                let isOnTopOfCombination = false
                let i = 0
                while (i < combination.length) {
                    if (container.id == combination[i].id) {
                        notInCombination = false
                        break
                    } else if (container.pos[COLUMN] == combination[i].pos[COLUMN] && container.pos[ROW] > combination[i].pos[ROW]) {
                        isOnTopOfCombination = true
                    }
                    i++
                }

                if (notInCombination && isOnTopOfCombination) {
                    cost += 2
                }
            }
        })
    }
    minCraneCost = oldMinCraneCost




    // moving all containers in combination to left
    let rightToLeftCost = 0
    rightContainers.forEach(container => {
        if (container.id == firstContainerID)
            rightToLeftCost += container.moveCost
        else
            rightToLeftCost += container.moveCost * 2
    })
    
    if (isBalanced) { // add cost of moving all containers not in combination to other side        
        let i = 0
        originalContainers.forEach(container => {
            // check if container is part of combination
            if (container.pos[COLUMN] < 6) {
                // check if container is part of combination
                let notInCombination = true
                let i = 0
                while (i < combination.length) {
                    if (container.id == combination[i].id) {
                        notInCombination = false
                        break
                    }
                    i++
                }

                if (notInCombination && container.craneCost < minCraneCost) {
                    minCraneCost = container.craneCost
                    firstContainerID = container.id // min craneCost is also the first move position
                }
            }
        })
        
        i = 0
        originalContainers.forEach(container => {
            // check if container is part of combination
            if (container.pos[COLUMN] < 6) {
                // check if container is part of combination
                let notInCombination = true
                let i = 0
                while (i < combination.length) {
                    if (container.id == combination[i].id) {
                        notInCombination = false
                        break
                    }
                    i++
                }

                if (notInCombination) {
                    if (container.id == firstContainerID)
                        rightToLeftCost += container.moveCost
                    else
                        rightToLeftCost += container.moveCost * 2
                }
            } else {
                // check that container is not part of combination and is on top of combination
                let notInCombination = true
                let isOnTopOfCombination = false
                let i = 0
                while (i < combination.length) {
                    if (container.id == combination[i].id) {
                        notInCombination = false
                        break
                    } else if (container.pos[COLUMN] == combination[i].pos[COLUMN] && container.pos[ROW] > combination[i].pos[ROW]) {
                        isOnTopOfCombination = true
                    }
                    i++
                }

                if (notInCombination && isOnTopOfCombination) {
                    cost += 2
                }
            }
        })
    }
    
    cost += Math.min(leftToRightCost, rightToLeftCost)
    cost += minCraneCost

    return cost
}




// ***************************************************************************************************************************************************************
// ***************************************************************************************************************************************************************


// SIFT starts below
// This is for when balancing is IMPOSSIBLE


function performSIFT(state) { // returns instructions for SIFT
    let initialNode = new Node(state)
	// Create a data structure to store the paths that are being explored
	let frontier = [initialNode]

	// Create an array to store all found states by a state ID
    // A 1 at the index of state ID means the state has been found, a 0 means it hasn't
    // This is to avoid exploring paths that have already been explored
    var foundStates = new Array(10000000).fill(null) // ***TESTING STATE ID ARRAY*** 
    // need array size to be 350996490 to handle maximum ship weight (full of containers weighing 99999)
    // size greater than 9999999 takes too long to initialize to all 0's

    // change this state to found so that it won't be explored anymore

    foundStates[getStateID(state)] = [state]

    // While there are paths being explored
    while (frontier.length > 0) {
        // Sort the paths in the frontier by total cost (path + heuristic cost), with the lowest-cost paths first
        frontier.sort(function(a, b) {
            return (a.pathCost + a.heuristicCost) - (b.pathCost + b.heuristicCost)
        })

        // Choose the lowest-cost path from the frontier
        let node = frontier.shift() // TAKES TOO LONG WHEN FRONTIER IS HUGE

        // If this node reaches the goal, return the node 
        if (isSIFTed(node.state)) {
        //if (node.heuristicCost == 0) {
            console.log("SUCCESS!")
            console.log("SIFTed State:")
            consolePrintState(node.state)

            // frontier.forEach(node => {
            //     consolePrintState(node.state)
            //     console.log("CRANE POS: " + node.move[NEW])
            //     console.log("HEURISTIC COST: " + getHeuristicCost(node.state, [8,0]))
            // })

            // return []
            return getInstructions(node)
        }

        frontier = expandSIFT(frontier, foundStates, node) // ***TESTING STATE ID***
    }

    // If there are no paths left to explore, return null to indicate that the goal cannot be reached
    console.log("ERROR: No SIFT found!")
    return null //Should never reach here
}

function expandSIFT(frontier, foundStates, node) { // branching function, max 12x11 branches
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



                        // If the stateID has already been generated, checks if the state has actually been found
                        // *** NEEDED FOR SIFT TO WORK, SIFT GENERATES LOTS OF REPEATED STATE ID's ***
                        let isNewState = true
                        if (foundStates[tempStateID] !== null) {
                            //console.log(foundStates[tempStateID])
                            for (let i = 0; i < foundStates[tempStateID].length; i++)
                                if (compareStates(tempState, foundStates[tempStateID][i]))
                                    isNewState = false
                        }




                        //foundStates[tempStateID] = null // ****************** REMOVE BEFORE FLIGHT *************************

                        // If this state has not been explored/found
                        //if (foundStates[tempStateID] === null) { 
                        if (isNewState) { //                     ******************** NEEDED BECAUSE STATE ID NOT UNIQUE IN SIFT ******************
                            let tempNode = new Node(tempState)
                            tempNode.pathCost = node.pathCost + getPathCost(node.state, node.move[NEW], move) // sends old state, old crane position, and new move as inputs
                            tempNode.heuristicCost = getSIFTHeuristicCost(tempState) // sends new state as input
                            tempNode.move = move
                            tempNode.parent = node

                            // Add the step to the frontier, using the cost and the heuristic function to estimate the total cost to reach the goal
                            frontier.push(tempNode)

                            // Mark the state as found
                            if (foundStates[tempStateID] === null)
                                foundStates[tempStateID] = [tempState]
                            else 
                                foundStates[tempStateID].push(tempState)
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

function isSIFTed(state) { // returns true if SIFTed, false if not
    let weights = getWeightsSortedHeaviestToLightest(state)

    // NEED TO ALSO CHECK NO CONTAINERS ON 9TH ROW

    // SIFTing layer by layer
    /*
    let SIFTrow = 0 // what row of SIFTing we're on
    while (weights.length > 0) {
        for (let i = 0; i < 6; i++) {
            for (let s = 0; s < 2; s++) { // what side we're checking (s: 0 = left, 1 = right)
                var column // ship and SIFT is symmetric so need to check both left and right sides
                if (s == 0)
                    column = 5 - i // checks left container in SIFT row
                else
                    column = 6 + i // checks right container in SIFT row

                let row = 0
                while (row < 9 && state[row][column].deadSpace == 1) // go to lowest container in column
                    row++
                
                row += SIFTrow // go to current SIFT row

                if (row < 9) {
                    if (weights.length > 0) {
                        let weight = weights.shift()
                        if (state[row][column].container == null || state[row][column].container.weight != weight)
                            return false
                    }
                    else return true
                }
            }
        } 
        SIFTrow++
    }
    //*/

    // SIFTing row by row
    let row = 0
    while (weights.length > 0 && row < 8) {
        for (let i = 0; i < 6; i++) {
            for (let s = 0; s < 2; s++) { // what side we're checking (s: 0 = left, 1 = right)
                var column // ship and SIFT is symmetric so need to check both left and right sides
                if (s == 0)
                    column = 5 - i // checks left container in SIFT row
                else
                    column = 6 + i // checks right container in SIFT row

                if (state[row][column].deadSpace == 0) { // if not a NAN
                    if (weights.length > 0) {
                        let weight = weights.shift()
                        if (state[row][column].container == null || state[row][column].container.weight != weight) // if SIFT container is not there
                            return false
                    }
                    else return true
                }
            }
        }
        row++
    }

    return true
}

function getSIFTHeuristicCost(state) { // returns true if SIFTed, false if not
    let weights = getWeightsSortedHeaviestToLightest(state)

    let cost = 0

    // SIFTing layer by layer
    /*
    let SIFTrow = 0 // what row of SIFTing we're on
    while (weights.length > 0) {
        for (let i = 0; i < 6; i++) {
            for (let s = 0; s < 2; s++) { // what side we're checking (s: 0 = left, 1 = right)
                var column // ship and SIFT is symmetric so need to check both left and right sides
                if (s == 0)
                    column = 5 - i // checks left container in SIFT row
                else
                    column = 6 + i // checks right container in SIFT row

                let row = 0
                while (row < 9 && state[row][column].deadSpace == 1) // go to lowest container in column
                    row++
                
                row += SIFTrow // go to current SIFT row
                
                if (row < 9) {
                    if (weights.length > 0) { // checks left container in SIFT row
                        let weight = weights.shift()
                        if (state[row][column].container == null || state[row][column].container.weight != weight) { // if the SIFT container is not there
                            while (row < 9 && state[row][column].container !== null) { // adds cost of moving all containers out of that spot
                                cost += 100000 // need to clear the SIFT cells of all other containers (top priority)
                                row++
                            }
                        }
                        else cost -= 100000 // subtract from cost any SIFT cells that already have their proper containers
                    }
                }
            }
        } 
        SIFTrow++
    }
    //*/

    // SIFTing row by row
    let row = 0
    while (weights.length > 0 && row < 8) {
        for (let i = 0; i < 6; i++) {
            for (let s = 0; s < 2; s++) { // what side we're checking (s: 0 = left, 1 = right)
                var column // ship and SIFT is symmetric so need to check both left and right sides
                if (s == 0)
                    column = 5 - i // checks left container in SIFT row
                else
                    column = 6 + i // checks right container in SIFT row

                let currentRow = row // save current row to go back to it after

                if (state[row][column].deadSpace == 0 && weights.length > 0) { // if not a NAN
                    let weight = weights.shift()
                    if (state[row][column].container == null || state[row][column].container.weight != weight) { // if the SIFT container is not there
                        while (row < 9 && state[row][column].container !== null) { // adds cost of moving all containers out of that spot
                            cost += 100000 // need to clear the SIFT cells of all other containers (top priority)
                            row++
                        }
                    }
                    else cost -= 100000 // subtract from cost any SIFT cells that already have their proper containers
                }
                row = currentRow // go back to current row
            }
        } 
        row++
    }

    return cost
}

function getWeightsSortedHeaviestToLightest(state) {
    let weights = []

    for (let column = 0; column < 12; column++) {
        let row = 0
        while (row < 8 && state[row][column].deadSpace == 1)
            row++
        
        while (row < 9 && state[row][column].container !== null) {
            if (state[row][column].container.weight > 0) // only care about non-empty containers
                weights.push(state[row][column].container.weight)

            row++
        }
    }

    weights.sort(function(a, b) { // sorts weights from largest to smallest
        return b - a
    })

    return weights
}




// ***************************************************************************************************************************************************************
// ***************************************************************************************************************************************************************


// Everything below is for returning the instructions only


function getInstructions(node) { // Calls recursive function to return all steps
    // console.log(1);
    var instructions = []
    // console.log(2);
	instructions = getInstructionsHelper(node, 0, instructions)
    
    let buffer = new Array(4).fill(new Array(24).fill({container: null, deadSpace: false})) // 4x24 array of empty cells
    let state = {ship: node.state, buffer: buffer, truck: 0}

    instructions.push({cost: 0, state: state, initialPos: {pos: [-1, -1], loc: 1}, finalPos: {pos: [-1 , -1], loc: 1}})

    console.log("ACTUAL COST: " + instructions[0].cost)

    //return {cost: node.pathCost, steps: instructions}
    return instructions
}

function getInstructionsHelper(node, cost, instructions) { // Recursively returns instructions in order
    if(node.parent === null)
    {
        return instructions
    }

    cost += node.pathCost - node.parent.pathCost

    // Retruns steps in order but not the very first redundant one (used to store intial crane position)
    if (node.parent != null && node.parent.parent != null)
        getInstructionsHelper(node.parent, cost, instructions)
    
    //instructions.push(node.move)
    //instructions.push({stepCost: (node.pathCost - node.parent.pathCost), stepState: node.state, step: node.move})

    let buffer = new Array(4).fill(new Array(24).fill({container: null, deadSpace: false})) // 4x24 array of empty cells
    let state = {ship: node.parent.state, buffer: buffer, truck: 0}

    instructions.push({cost: cost, state: state, initialPos: {pos: node.move[OLD], loc: 1}, finalPos: {pos: node.move[NEW], loc: 1}})

    return instructions
}







// EDGAR'S CODE BELOW

// creating a react component to show that we are currently computing the steps
function ComputeSteps(props)
{
    const [isLoading, setIsLoading] = useState(true);
    const [steps, setSteps] = useState(null);

    useEffect(() => {
        async function runAlgorithm() {
           setIsLoading(true);
           try {
                setSteps(await balance(props.grid));
           } catch (error) {
              console.error(error);
           } finally {
              setIsLoading(false);
           }
        }
        runAlgorithm();
    }, []);
    if (isLoading) {
        return (
            <div id="loadingBalanceSteps">
                <h3 style={{ color: 'black' }}>Generating Steps...</h3>
            </div>
        )
    }
    else if (steps) {
        props.parentRecieveSteps({steps});
        setSteps(null);
        setIsLoading(false);
        return;
    }
    return (
        <div id="loadingBalanceSteps">
            <h3 style={{ color: 'black' }}>Done!</h3>
        </div>
    )
    //  return <div style={{ color: 'black' }}>No data</div>;
}
export default ComputeSteps;