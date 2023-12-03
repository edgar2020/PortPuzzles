class Node {
	constructor(ship) {
		this.state = ship;
		this.pathCost = 0; // total path cost (actual cost in minutes to get to current state)
		this.heuristicCost = 0; // estimated cost in minutes left to reach balance
        // ((old row, old column), (new row, new column))
		this.move = [[8,0],[8,0]]; // initial crane position
		this.parent = null;
	}
}

let x = 0;
export function balance(ship) {  // returns instructions to balance, already balanced returns empty instructions
	console.log("START" + x++);
    console.log(ship);

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
        // Sort the paths in the frontier by total cost (path + heuristic cost), with the lowest-cost paths first
        frontier.sort(function(a, b) {
            return (a.pathCost + a.heuristicCost) - (b.pathCost + b.heuristicCost);
        });

        // Choose the lowest-cost path from the frontier
        let node = frontier.shift();

        // Add this nodeto the explored paths
        explored.push(node);
        // If this node reaches the goal, return the node 
        if (isBalanced(node.state)) {
            return getInstructions(node);
        }

        frontier = expand(frontier, explored, node);
    }

    // If there are no paths left to explore, return null to indicate that the goal cannot be reached
    console.log("ERROR: No Balance found!")
    return null; //Should never reach here
}

function expand(frontier, explored, node) { // branching function
    // For every column, check every column
    for (let l = 0; l < 12; l++) {
        if ((l != node.move[1][1] || node.move[0] == node.move[1]) && node.state[0][l]) {// if (not moving container just moved OR doing first move) AND column has containers 
            for (let d = 0; d < 12; d++) {
                if (d != l && !node.state[8][d]) { // if not making redundant move, and coulumn has available spot at top
                    var tempNode;
                    // tempNode = createNewNode(node, l, d);
                    let tempState = getNewState(node.state, getMove(node.state, l, d));

                    // // Check if this step has already been explored
                    let isExplored = (explored.find( e => {
                        return e.state == tempNode.state
                    }))

                    // //avoid repeated nodes during the calculation of neighbors
                    let isFrontier = (frontier.find( e => {
                        return e.state == tempNode.state
                    }))


                    // // If this step has not been explored
                    if (!isExplored && !isFrontier) {
                        // Add the step to the frontier, using the cost and the heuristic function to estimate the total cost to reach the goal
                        frontier.push(tempNode);
                    }
                }
            }
        }
    }
}

function getMove(state, oldColumn, newColumn) {
    let oldRow = 0;
    while (state[oldRow + 1][oldColumn]) // finds top container row in old column
        oldRow++; // increment if container on top of cell

    let newRow = 0;
    while (state[newRow][newColumn]) // finds top empty cell in new column
        newRow++; // increment if cell has container

    return [[oldRow, oldColumn], [newRow, newColumn]]; // the move is returned
}

function createNewNode(oldNode, move) {


    let newNode = new Node(getNewState(oldNode.state, move));



   // newNode.pathCost = oldNode.pathCost + getPathCost(node.state);
    //newNode.heuristicCost = getHeuristicCost(node.state);
    newNode.move = move;
    // newNode.parent = node;
    // return newNode;
}

function getNewState(oldState, move) {
    let newState = oldState;
    newState[move[0][0]][move[0][1]] = 0; // need to change to empty cell   ***CHANGE***
    newState[move[1][0]][move[1][1]] = oldState[move[0][0]][move[0][1]]; // container is now in new cell
    return newState;
}

function getPathCost() {

}
 
function getHeuristicCost() {

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
    if (node.parent != null)
        getInstructionsHelper(node.parent, instructions);
    
    instructions.push(node.move);
    return instructions;
}