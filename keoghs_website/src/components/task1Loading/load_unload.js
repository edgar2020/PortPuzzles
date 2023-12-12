import React, { useEffect, useState, Component } from 'react';
// function to print a State or 2D array of ship
function consolePrintState(node) {
    let state = node.shipState
    for (let row = 8; row >= 0; row--) {
        let a = []
        a.push(row + 1)
        for (let column = 0; column < 12; column++) {
            if (state[row][column].container)
                a.push(state[row][column].container.name[0])
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

    console.log("H: "+ node.heuristicCost);
}
function printShip(ship) {
    for (let row = 8; row >= 0; row--) {
        let a = []
        a.push(row + 1)
        for (let column = 0; column < 12; column++) {
            if (ship[row][column].container)
                a.push(ship[row][column].container.name[0])
            else if (ship[row][column].deadSpace)
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

//function to print a Node
function show_Node(node)
{
    let s= "";
    s += "G: " + node.pathCost;
    s += "\tH: " + node.heuristicCost;
    s += "\tF: " + node.f;
    
    // consolePrintState(node.shipState)
    console.log("----------------------------------")
    console.log("\tUnloads left: "+ node.unloads_left.length)
    console.log("\tLoads left: "+ node.loads_left.length)
    console.log(s)
    console.log("----------------------------------")
    
}

const rows = 9
const cols = 12
let finished_load = false;
let finished_unload = false;

const OLD = 0
const NEW = 1
const ROW = 0
const COLUMN = 1

let list_of_unloads = [] // assuming fileReader gives me this array/list
let list_of_loads = [] //assuming fileReader gives me this number 
// load_names -- do we need it?

var mapStates = new Map();

//try to limit the number of iterations so that the search doesn't go too big
let max_iterations = 20000
let num_iterations = 0 // start at 0, increment at each iteration

class Node {
	constructor(ship, buffer) {
		this.shipState = structuredClone(ship) // should make a copy of "ship" grid array
        // TODO Added buffer state
		this.bufferState = structuredClone(buffer) // Buffer for the array
		this.pathCost = 0
		this.heuristicCost = 0
		this.parent = null // copy of previous Node
        this.unloads_left = [] // list of containers coordinates left to be unloaded
        this.loads_left = [] // list of containers left to be loaded
        // loc: 1 if ship, 2 if buffer, 3 if truck, also changed format to better mimic adolfos
        this.initial_loc = {pos: [8, 0], loc: 1 } // initial location of crane
        this.final_loc = {pos: [8,0], loc: 1 }  // final location of crane
	}

    //function to check if two nodes are equal
    isEqual(other) 
    {
        // TODO: are the load_left and loads_unleft really necessary? And differences will already be visible when you checkStatesEqual 
        return (checkStatesEqual(this.shipState, other.shipState))
        //Note for later: maybe also check equality for initial_loc and final_loc
    }
    // use as ``node1.isEqual(node2)''

    //function to check if (thisNode's f is < otherNode's f)
    isLessThan(other)
    {
        let this_f = this.pathCost + this.heuristicCost
        let other_f = other.pathCost + other.heuristicCost
        if(this_f  == other_f)
        {
            return this.heuristicCost < other.heuristicCost
        }
        else
        {
            return this_f < other_f;
        }
    }
    //function to check if (thisNode's f is > otherNode's f)
    isGreaterThan(other)
    {
        let this_f = this.pathCost + this.heuristicCost
        let other_f = other.pathCost + other.heuristicCost

        if (this_f == other_f)
            return this.heuristicCost > other.heuristicCost
        else
            return this_f > other_f
    }

}

// GENERAL SEARCH ALGORITHM (searches for states, enqueues explored ones, checks if its final state )
function finalStateSearch(ss, loads, unloads) {

    console.log("Starting algo");
    // condition where no steps necessary (working)
    
    
    // returns instructions for fastest load/unload
    // TODO add buffer instead of []
    let initialNode = new Node(structuredClone(ss), [])
    
    // hash map for repeated states
    mapStates.set(JSON.stringify(initialNode.shipState), initialNode);
    
    if(unloads.length!=0)
    {
        initialNode.unloads_left = unloads
    }
    if(loads !=0)
    {
        initialNode.loads_left = loads
    }
    
    console.log("---Printing initial node--")
    show_Node(initialNode)
    console.log(initialNode)
    console.log("---Printing initial node done -- ")
	// Create a data structure to store the paths that are being explored
	let frontier = [initialNode]

	// Create an empty data structure to store the explored paths
	let explored = []
	
    // While there are paths being explored
    while (frontier.length > 0) 
    {
        num_iterations++;
        if(num_iterations > max_iterations)
        {
            console.log("FAILURE: Unable to find load/unload operation list in time")
            console.log("Final manifest preview shown below:\n")
            // return getInstructions(min_f)
            return
        }

        // Sort the paths in the frontier by f(g+h), with the lowest-cost paths first
        frontier.sort(
            function(a, b) {return (a.pathCost + a.heuristicCost) - (b.pathCost + b.heuristicCost)}
        )
        
        // Choose the lowest-cost path from the frontier
        let curr_node = frontier.shift()

        explored.push(curr_node) // Add this node to the explored paths
        
        // If this node reaches the goal, return the node 
        if (taskComplete(curr_node)) 
        {
            console.log("SUCCESS! Instructions:")
            return getInstructions(curr_node)
        }

        frontier = expand(frontier, curr_node)
    }

    // If there are no paths left to explore, return null to indicate that the goal cannot be reached
    console.log("ERROR: No paths left to explore found!")
    return null //Should never reach here
}


function getInstructions(node) { // Calls recursive function to return all steps
    var instructions = []
	instructions = getInstructionsHelper(node, 0, instructions)
    
    let buffer = new Array(4).fill(new Array(24).fill({container: null, deadSpace: false})) // 4x24 array of empty cells
    let state = {ship: node.shipState, buffer: buffer, truck: 0}

    instructions.push({cost: 0, state: state, initialPos: {pos: [-1, -1], loc: 1}, finalPos: {pos: [-1 , -1], loc: 1}})

    console.log("ACTUAL COST: " + instructions[0].cost)

    return instructions
}

function getInstructionsHelper(node, cost, instructions) { // Recursively returns instructions in order
    if(node.parent === null)
    {
        return instructions
    }
    // console.log(node);
    cost += node.pathCost - node.parent.pathCost

    // Retruns steps in order but not the very first redundant one (used to store intial crane position)
    if (node.parent != null && node.parent.parent != null)
        getInstructionsHelper(node.parent, cost, instructions)
    
    
    let buffer = new Array(4).fill(new Array(24).fill({container: null, deadSpace: false})) // 4x24 array of empty cells
    let state = {ship: node.parent.shipState, buffer: buffer, truck: 0}
    
    let moveThisContainer = node.initial_loc;
    // console.log(node.parent.loads_left);
    if(node.initial_loc.loc === 3)
    {
        // console.log(node.parent.loads_left[0]);
        moveThisContainer.newContainer = node.parent.loads_left[0];
    }

    instructions.push({cost: cost, state: state, initialPos: moveThisContainer, finalPos: node.final_loc})

    return instructions
}


// state is the 2d ship array
// old columm where move originates( use index aka start at 0)
// new columm where move ends( use index aka start at 0)

function getMove(state, start, end)
{ // returns empty array if move is invalid
    // first check what type of move it is
    // ship to ship
    let oldColumn = start.col
    let newColumn = end.col

    // if move from ship tp ship
    if(start.loc === 1 && end.loc === 1)
    {
        let column = Math.min(oldColumn + 1, newColumn + 1)
        while (column < Math.max(oldColumn, newColumn)) {
            if (state[8][column].deadSpace == 1 || state[8][column].container !== null) // returns invalid if impossible to move from oldColumn to newColumn
            {
                return []
            }

            column++
        }
        // next check if there is a container in oldColumn
        let oldRow = 0
        while (oldRow < 9 && state[oldRow][oldColumn].deadSpace == 1)
            oldRow++
        if (oldRow == 9 || state[oldRow][oldColumn].container === null) // returns invalid if no containers in oldColumn
        {
            return []
        }

        while (oldRow < 8 && state[oldRow + 1][oldColumn].container !== null) // finds top container row in old column
            oldRow++ // increment if container on top of cell

        let newRow = 0
        while (newRow < 9 && (state[newRow][newColumn].container !== null || state[newRow][newColumn].deadSpace == 1)) // finds top empty cell in new column
            newRow++ // increment if cell has container

                
        return [{pos: [oldRow, oldColumn], loc: 1},{pos: [newRow, newColumn], loc: 1}] // the move is returned               
    }
    else if(start.loc === 1 && end.loc === 3)  // move ship to truck
    {
        let column = oldColumn;
        while (column >= 0) { //pink square is 8,0
            if (state[8][column].deadSpace == true || state[8][column].container !== null) // returns invalid if impossible to move from oldColumn to newColumn
            {    
                return []
            }
            column--
        }
        // next check if there is a container in oldColumn
        let oldRow = 0
        while (oldRow < 8 && state[oldRow][oldColumn].deadSpace == true) //find where unusable slots stops
            oldRow++
        if (oldRow == 8 || state[oldRow][oldColumn].container === null) // returns invalid if no containers in oldColumn
        {    
            return []
        }

        while (oldRow < 9 && state[oldRow + 1][oldColumn].container !== null) // finds top container row in old column
            oldRow++ // increment if container on top of cell

        return [{pos: [oldRow, oldColumn], loc: 1},{pos: [0, 0], loc: 3}] // the move is returned              
    }
    else if(start.loc === 3 && end.loc === 1)// move truck to ship
    {
        let column = 0;
        while (column <= newColumn) { //pink square is 8,0
            if (state[8][column].deadSpace == true || state[8][column].container !== null) // returns invalid if impossible to move from oldColumn to newColumn
            {    
                return []
            }
            column++
        }
        
        let newRow = 0
        while (newRow < 8 && (state[newRow][newColumn].container !== null || state[newRow][newColumn].deadSpace == true)) // finds top empty cell in new column
            newRow++ // increment if cell has container

        if(newRow === 8)
        {    
            return []
        }


        return [{pos: [0, 0], loc: 3},{pos: [newRow, newColumn], loc: 1}] // the move is returned     
    }
    else
    {
        // TODO buffer stuff
    }
    return []
    
    return [];
    // ship to truck 
    // truck to ship
    // ship tp buffer
    // buffer to ship
}

function getNewState(oldState, move, container) {
    // console.log(move[OLD]);
    let oldLocation = move[OLD].loc
    let oldPos = move[OLD].pos
    let newLocation = move[NEW].loc
    let newPos = move[NEW].pos
    
    var newState = structuredClone(oldState) //2d ship array
    
    if(oldLocation === 1 && newLocation === 1)// moving from ship to ship
    {
        newState[oldPos[ROW]][oldPos[COLUMN]] = {container: null, deadSpace: false} // replace old location with empty cell
        newState[newPos[ROW]][newPos[COLUMN]] = oldState[oldPos[ROW]][oldPos[COLUMN]] // container is now in new cell    
        return newState
    } else if (oldLocation === 1 && newLocation === 3) //moving ship to truck
    {
        newState[oldPos[ROW]][oldPos[COLUMN]] = {container: null, deadSpace: false} // replace old location with empty cell
        return newState
    } else if(oldLocation === 3 && newLocation === 1) //moving truck to ship
    {
        // TODO getNewState for truuck to ship (make it so you can call a container over)
        newState[newPos[ROW]][newPos[COLUMN]] = {container: container, deadSpace: false, offload: false} // container is now in new cell    
        return newState
    } else
    {
        // TODO buffer stuff
    }
    // 

    // newState[move[OLD][ROW]][move[OLD][COLUMN]] = {container: null, deadSpace: false} // replace old location with empty cell
    // newState[move[NEW][ROW]][move[NEW][COLUMN]] = oldState[move[OLD][ROW]][move[OLD][COLUMN]] // container is now in new cell    
    return newState
}

function getPathCost(node, move) {
    let oldLocation = move[OLD].loc
    let oldPos = move[OLD].pos
    let newLocation = move[NEW].loc
    let newPos = move[NEW].pos

    let cost = 0
    // cost of path within ship
    if(oldLocation === 1 && newLocation === 1)
    {
        // first initializes values to calculate cost moving crane to position
        let maxMoveHeight = Math.max(node.final_loc.pos[ROW], oldPos[ROW])
        let left = Math.min(node.final_loc.pos[COLUMN], oldPos[COLUMN])
        let right = Math.max(node.final_loc.pos[COLUMN], oldPos[COLUMN])
        
        for (let i = 0; i < 2; i++) {
            // add Manhattan Distance to cost
            if (i == 0) { // First will add cost to move crane to old container location
                cost += Math.abs(node.final_loc.pos[ROW] - oldPos[ROW]) // add vertical crane distance to cost
                cost += Math.abs(node.final_loc.pos[COLUMN] - oldPos[COLUMN]) // add horizontal crane distance to cost 
            } 
            else { // Then will add actual cost of move
                cost += Math.abs(newPos[ROW] - oldPos[ROW]) // add vertical distance to cost
                cost += Math.abs(newPos[COLUMN] - oldPos[COLUMN]) // add horizontal distance to cost

                maxMoveHeight = Math.max(newPos[ROW], oldPos[ROW])
                left = Math.min(newPos[COLUMN], oldPos[COLUMN])
                right = Math.max(newPos[COLUMN], oldPos[COLUMN])
            }

            // add any additional cost caused by containers blocking path
            let maxObstacleHeight = maxMoveHeight    
            for (let column = left + 1; column < right; column++) { // for all columns between old and new locations
                let row = 0
                while (row < 9 && node.shipState[row][column].deadSpace == 1)
                    row++
                
                while (row < 9 && node.shipState[row][column].container !== null)
                    row++
                
                if (row > maxObstacleHeight)
                    maxObstacleHeight = row
            }
            cost += 2 * (maxObstacleHeight - maxMoveHeight) // what goes up must come down
        }
        return cost
    }
    else if(oldLocation === 1 && newLocation === 3) //ship to truck
    {
        let left = 0
        let right = oldPos[COLUMN]

        cost += Math.abs(node.final_loc.pos[COLUMN] - oldPos[COLUMN]) // add horizontal crane distance to cost 
        cost += Math.abs(node.final_loc.pos[ROW] - oldPos[ROW]) // add vertical crane distance to cost 

        let maxMoveHeight = Math.max(node.final_loc.pos[ROW], oldPos[ROW])
        left = Math.min(node.final_loc.pos[COLUMN], oldPos[COLUMN])
        right = Math.max(node.final_loc.pos[COLUMN], oldPos[COLUMN])

        // add any additional cost caused by containers blocking path
        let maxObstacleHeight = maxMoveHeight    
        for (let column = left + 1; column < right; column++) { // for all columns between old and new locations
            let row = 0
            while (row < 9 && node.shipState[row][column].deadSpace == true)
                row++
            while (row < 9 && node.shipState[row][column].container !== null)
                row++
            if (row > maxObstacleHeight)
                maxObstacleHeight = row
        }
         cost += 2 * (maxObstacleHeight - maxMoveHeight) // what goes up must come down

         cost += Math.abs(8 - oldPos[ROW]) // add vertical crane distance to cost
         cost += Math.abs(0 - oldPos[COLUMN]) // add vertical crane distance to cost
         cost += 2 //time it takes to go from pink portal to
        return cost

    }
    else if(oldLocation === 3 && newLocation === 1) //truck to ship
    {
        if(node.final_loc.loc === 1)
        {
            cost+=2
            cost += Math.abs(8 - node.final_loc.pos[ROW]) // add vertical crane distance to cost
            cost += Math.abs(0 - node.final_loc.pos[COLUMN]) // add vertical crane distance to cost
        }
        cost += 2 //time it takes to go from pink portal to

        let left = 0
        let right = newPos[COLUMN]

        cost += Math.abs(0 - newPos[COLUMN]) // add horizontal crane distance to cost 
        cost += Math.abs(8 - newPos[ROW]) // add vertical crane distance to cost 
        return cost
    }
    else
    {
        // TODO buffer stuff
    }
    
    return cost
}
// function getHeuristicCost(shipState, toUnload, toLoad ) {
//     let H = 0
//     // minimum cost of moving containers from toLoad
//     for(let i = 0; i < toLoad.length; i++)
//     {
//         H += 3+i;

//     }
//     // calculate the cost of manhattan distance for every container to offload
//     for(let j = 0; j < toUnload.length; j++)
//     {
//         H += 8-toUnload[j][ROW] //vertical distance
//         // console.log("("+toUnload[j][ROW]+", "+toUnload[j][COLUMN]+")")
//         H += toUnload[j][COLUMN] //horizontal distance
//         H += 2 //cost to get to ship
//     }

//     // Add cost of containers blocking the unloads
//     let columns_With_ContainersToMove = []; 
//     // find all columns with containers to remove in them
//     for(var i = 0; i < toUnload.length; i++)
//     {
//         columns_With_ContainersToMove.push(toUnload[i][COLUMN]);
//     }
//     // remove duplicate columns
//     columns_With_ContainersToMove = [... new Set(columns_With_ContainersToMove)]
//     for(var i = 0; i < columns_With_ContainersToMove.length; i++)
//     {
//         let seenOffload = false;
//         let col = columns_With_ContainersToMove[i];
//         // check every row except row 8
//         for(let row = 0; row <= 7; row++)
//         {
//             // if a container whose offload === false add a cost
//             if(shipState[row][col].offload === true)
//             {
//                 seenOffload = true;
//             }
//             else if(seenOffload && shipState[row][col].container !== null && shipState[row][col].offload === false)
//             {
//                 H++;
//             }
//         }
//     }
    
//     // console.log("H3:"+H)
//     // add cost for anything in the 9th row
//     for(var col = 0; col < 12; col++)
//     {
//         if(shipState[8][col].container !== null)
//         {
//             H += 2
//         }
//     }

//     // console.log("H4:"+H)
    
//     return H
// }

// Adolfo's Heuristic:
function getHeuristicCost(shipState, toUnload, toLoad ) {
    let H = 0
    
    H += toLoad.length * 100000 // add to H (the # of containers left to load) x (big constant)

    toUnload.forEach(container => {
        let row = container[ROW]
        let column = container[COLUMN]
        while (row < 9 && shipState[row][column].container !== null) {
            H += 100000 // add to H ((the # of containers left to unload) + (# of containers on top)) x (big constant)
            row++
        }
    })
    
    return H
}


function expand(frontier, node) { // branching function, max 12x11 branches
    console.log("EXPANDING NODE ")
    // consolePrintState(node);
    // consolePrintState(node)
    // TODO: look at the columns of all containers to remove (coordinates are NOT 0 indexed)
    // TODO: Look at columns with container to be remove - move to truck (if removable),move to other column, move to buffer,
    // TODO: Load Container onto ship in a column that does not have a container to be removeed
    let columns_With_ContainersToMove = []; 
    // find all columns with containers to remove in them
    for(let i = 0; i < node.unloads_left.length; i++)
    {
        columns_With_ContainersToMove.push(node.unloads_left[i][COLUMN]);
    }
    // add all columns with containers in the 9th row
    for(let i = 0; i < 12; i++)
    {
        try {
            if(node.shipState[8][i].container !== null)
            {
                columns_With_ContainersToMove.push(i);
            }
        } catch (error) {console.log(error)}
    }
    // remove duplicates columns
    columns_With_ContainersToMove = [...new Set(columns_With_ContainersToMove)]

    // got to the columns with a container that need to be offloaded
    for(let i = 0; i < columns_With_ContainersToMove.length; i++)
    {
        let origCol = columns_With_ContainersToMove[i]
        let rowNum = 0;
        // find container at the top of the column
        while(rowNum < 8 && node.shipState[rowNum+1][origCol].container != null)
        {
            rowNum++;
        }
        // curContainer is the current container that will be moved
        let curContainer = node.shipState[rowNum][origCol];
        let startOfMove = {loc: 1, col: origCol}
    
        // create a node for where a blocking container can move too
        if(curContainer.offload !== true) //container does not need to be removed
        {
            // if not moving container just moved OR doing first move 
            if (origCol != node.final_loc.pos[COLUMN] || node.parent === null) {
                for (let destCol = 0; destCol < 12; destCol++) 
                {
                    let endOfMove = {loc: 1, col: destCol}
                    if (destCol !== origCol && node.shipState[8][destCol].container === null) 
                    { // if not making redundant move, and coulumn has available spot at top
                        let move = getMove(node.shipState, startOfMove, endOfMove)
                        if(move.length>0)
                        {
                            let tempState = getNewState(node.shipState, move)
                            let tempStateID = mapStates.get(JSON.stringify(tempState.shipState))
                            
                            // If this state has not been explored/found
                            if (tempStateID === undefined) 
                            {
                                let tempNode = new Node(tempState, [])
                                let unloads = structuredClone(node.unloads_left)
                                let loads = structuredClone(node.loads_left)
                                tempNode.heuristicCost = getHeuristicCost(tempState, unloads, loads)        
                                tempNode.loads_left = loads
                                tempNode.unloads_left = unloads
                                tempNode.pathCost = node.pathCost + getPathCost(node, move)
                                tempNode.initial_loc = move[OLD]
                                tempNode.final_loc = move[NEW]
                                tempNode.parent = structuredClone(node);
                                
                                mapStates.set(JSON.stringify(tempNode.shipState), tempNode);
                                frontier.push(tempNode)
                            } 
                        }
                    }
                }
            }
        } 
        else //create a node where container to be offloaded is moved from ship to truck
        {
            let endOfMove = {loc: 3, col: 0}
            let move = getMove(node.shipState, startOfMove, endOfMove)
            
            // console.log(move);
            if(move.length>0)
            {
                let tempState = getNewState(node.shipState, move)
                let tempStateID = mapStates.get(JSON.stringify(tempState.shipState))
                // console.log(move[OLD].pos)
                // If this state has not been explored/found
                if (tempStateID === undefined) 
                {
                    let tempNode = new Node(tempState, [])
                    let loads = structuredClone(node.loads_left)
                    let unloads = structuredClone(node.unloads_left);
                    for(let it = 0; it < unloads.length; it++)
                    {
                        if(move[OLD].pos[COLUMN] === unloads[it][COLUMN] && move[OLD].pos[ROW] === unloads[it][ROW])
                        {
                            unloads.splice(it, 1);
                            break;
                        }
                    }
                    tempNode.heuristicCost = getHeuristicCost(tempState, unloads, loads)        
                    tempNode.loads_left = loads
                    tempNode.unloads_left = unloads
                    tempNode.pathCost = node.pathCost + getPathCost(node, move)
                    tempNode.initial_loc = move[OLD]
                    tempNode.final_loc = move[NEW]
                    tempNode.parent = structuredClone(node);
                    
                    mapStates.set(JSON.stringify(tempNode.shipState), tempNode);
                    frontier.push(tempNode)
                } 
            }
        }
    }
    // try adding a container from truck to ship
    if(node.loads_left.length > 0 )
    {
        let columns_Without_ContainersToMove = [0,1,2,3,4,5,6,7,8,9,10,11].filter(x => !columns_With_ContainersToMove.includes(x));
        
        for(let destCol in columns_Without_ContainersToMove)
        {
            // console.log("DestCol: "+destCol);
            let move = getMove(node.shipState, {loc: 3, col: 1}, {loc: 1, col: parseInt(destCol)})
            if(move.length>0)
            {
                let loads = structuredClone(node.loads_left)
                let curContainer = loads.shift();
                let tempState = getNewState(node.shipState, move, curContainer)
                let tempStateID = mapStates.get(JSON.stringify(tempState.shipState))
                
                // If this state has not been explored/found
                if (tempStateID === undefined) 
                {
                    let tempNode = new Node(tempState, [])
                    let unloads = structuredClone(node.unloads_left)
                    tempNode.heuristicCost = getHeuristicCost(tempState, unloads, loads)        
                    tempNode.loads_left = loads
                    tempNode.unloads_left = unloads
                    tempNode.pathCost = node.pathCost + getPathCost(node, move)
                    tempNode.initial_loc = move[OLD]
                    tempNode.final_loc = move[NEW]
                    tempNode.parent = structuredClone(node);
                    
                    mapStates.set(JSON.stringify(tempNode.shipState), tempNode);
                   
                    frontier.push(tempNode)
                } 
            }
        }

    }
    // for every column with container to remove ==
        // find the container at the very top ==
            // if it needs to go to the truck ==
                // create a new node where the container was moved to truck==
            // else (it does not need to be removed)==
                // do something==
                // create a node for every column where the container is not currently in==
                // TODO: currently not considereing the buffer
    // if containers to load==
        // for every available column==
            // create a node where the container is moved to that column==
    return frontier
}

function taskComplete(node) // returns true if no unloading/loading to be done
{
    if(node.loads_left.length <= 0 && node.unloads_left.length <= 0)
    {
        // checls that no containers in the 9th row
        for(let c = 0; c <= 11; c++)
        {
            if(node.shipState[8][c].container !== null)
            {
                return false
            }
        }
        finished_load = true;
        finished_unload = true;
        return true;
    }
    return false;
}

//helper function that performs deep comparison of two 2D arrays
function checkStatesEqual(state1, state2) 
{
    if (state1.length !== state2.length) 
        return false;

    for (let i = 0; i < state1.length; i++) 
    {
        if (state1[i].length !== state2[i].length) 
            return false;
        for (let j = 0; j < state1[i].length; j++) 
        {
            if (state1[i][j] !== state2[i][j]) 
                return false;
        }
    }
    return true;
}

async function main(shipState, load_list)
{
    for(let i=0; i< 8; i++)
    {
        for(let j=0; j<11; j++)
        {
            if(shipState[i][j].offload == true)
            {
                list_of_unloads.push([i, j])
            }
        }
    }
    return finalStateSearch(shipState, load_list, list_of_unloads)
    
}
// Display the component on the screen

// creating a react component to show that we are currently computing the steps
function ComputeSteps(props)
{
    const [isLoading, setIsLoading] = useState(true);
    const [steps, setSteps] = useState(null);

    useEffect(() => {
        async function runAlgorithm() {
           setIsLoading(true);
           try {
            // call the algorithm incharge of the search
                setSteps(await main(props.grid, props.load));
           } catch (error) {
              console.error(error);
           } finally {
              setIsLoading(false);
           }
        }
        runAlgorithm();
    }, [props.grid, props.load]);
    if (isLoading) {
        return (
            <div id="UbloadingSteps">
                <h3 style={{ color: 'black' }}>Generating Steps...</h3>
            </div>
        )
    }
    if (steps) {
        props.parentRecieveSteps({steps});
        setSteps(null);
        setIsLoading(false);
        return;
    }
    return (
        <div id="UnloadingSteps">
            <h3 style={{ color: 'black' }}>Done!</h3>
        </div>
    )
    //  return <div style={{ color: 'black' }}>No data</div>;
}
export default ComputeSteps;