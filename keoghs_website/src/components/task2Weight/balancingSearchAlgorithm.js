import React, { useState, useEffect } from 'react';

class Node {
	constructor(ship) {
		this.state = ship;
		this.totalCost = 0;
		this.heuristicCost= 0;
        // ((old row, old column), (new row, new column))
		this.lastMove = [[8,0],[8,0]]; // initial crane position
		this.lastNode = null;
	}
}

let x = 0; 
export function balance(ship) {  // returns instructions to balance, already balanced returns empty instructions
	console.log("START" + x++);
    console.log(ship);
    return [];
    
    if (isBalanced(ship))
    return [];
    else if (balancePossible(ship)) 
        return balanceSearch(ship);
    else 
    return performSIFT(ship);
}

function isBalanced(state) { // returns true if balanced, false if isn't

}

function balancePossible(state) { // returns true if possible to balance, false if impossible

}

function balanceSearch(state) { // returns instructions for fastest balance
    let initialNode = new Node(state);
	// Create a data structure to store the paths that are being explored
	let frontier = [initialNode];

	// Create an empty data structure to store the explored paths
	let explored = [];
	
    // While there are paths being explored
    while (frontier.length > 0) {
        // Sort the paths in the frontier by cost, with the lowest-cost paths first
        frontier.sort(function(a, b) {
            return (a.totalCost + a.heuristicCost) - (b.totalCost + b.heuristicCost);
        });

        // Choose the lowest-cost path from the frontier
        let node = frontier.shift();

        // Add this nodeto the explored paths
        explored.push(node);
        // If this nodereaches the goal, return thenode 
        if (isBalanced(node.state)) {
            return getInstructions(node);
        }

        frontier = expand(frontier, explored, node);
    }

    // If there are no paths left to explore, return null to indicate that the goal cannot be reached
    return null;
}

function expand(frontier, explored, node) { // not finished
    // For every column, check every column
    for (let l = 0; l < 12; l++) {
        if ((l != node.lastMove[1][1] || node.lastMove[0][1] == node.lastMove[1][1]) && node.state[0][l]) {// if (not moving container just moved OR doing first move) AND column has containers 
            for (let d = 0; d < 12; d++) {
                if (d != l && !node.state[8][d]) { // if not making redundant move, and coulumn has available spot at top
                    let newNode = createNewNode(node, l, d);
        

                    // // Calculate the cost of the next step by adding the step's cost to the node's cost
                    // let cost = step.cost + node.cost;

                    // // Check if this step has already been explored
                    // let isExplored = (explored.find( e => {
                    //     return e.state == newNode.state
                    // }))

                    // //avoid repeated nodes during the calculation of neighbors
                    // let isFrontier = (frontier.find( e => {
                    //     return e.state == newNode.state
                    // }))


                    // // If this step has not been explored
                    // if (!isExplored && !isFrontier) {
                    //     // Add the step to the frontier, using the cost and the heuristic function to estimate the total cost to reach the goal
                    //     frontier.push(newNode);
                    // }
                }
            }
        }
    }
}

function createNewNode(node, l, d) { // not finished
    let oldRow = 0;
    while (node.state[oldRow][l])
        oldRow++;

    let newRow = 0;
    while (node.state[newRow][d]) // change
        newRow++;


    // newNode = new Node;
    // newNode.state = newState(node.state, l, d);
    // newNode.totalCost = node.totalCost + pathCost(node, l, d);
    // newNode.heuristicCost = heuristicCost(node.state);
    // newNode.lastMove = []
    // newNode.lastNode = node;
    // return newNode;
}

function performSIFT(state) { // return instructions for SIFT
    //let initialNode = new Node(state);
}

function getInstructions(node) {
    let instructions = [];
	instructions = getInstructionsHelper(node, instructions);
    return instructions;
}

function getInstructionsHelper(node, instructions) {
    if (node.lastNode != null)
        getInstructionsHelper(node.lastNode, instructions);
    
    instructions.push(node.lastMove);
    return instructions;
}



function GenerateBalanceSteps(props)
{   
    // useEffect(() => {
    //     balance(props.input);
    // }, []);
    const callBalance = (inputGrid) => {
        [] = balance(inputGrid);

    }
    //     // console.log(this.props.input);
    //     // const steps = await balance(this.props.grid);
    //     // this.setState({stillGenerating: false});
    //     // alert(col);
    //     // this.props.parentRecieveSteps(steps);
    // // }
 
    return (
        <div id="generateBalancingStepsContainer" className='generatingSteps'>
        <h3>Generating steps</h3>
        {callBalance(props.input)}
        </div>   
    );
}
export default GenerateBalanceSteps;