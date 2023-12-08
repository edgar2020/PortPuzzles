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

const rows = 9
const cols = 12
finished_load = false;
finished_unload = false;

let list_of_unloads = [] // assuming fileReader gives me this array/list
let list_of_loads = [] //assuming fileReader gives me this number 
// load_names -- do we need it?

class Node {
	constructor(ship) {
		this.state = structuredClone(ship) // should make a copy of "ship" grid array
		this.pathCost = 0
		this.heuristicCost = 0
        this.f = this.pathCost + this.heuristicCost; // f = g+h
        
		this.parent = null // pointer to previous Node

        this.unloads_left = [] // list of containers left to be unloaded
        this.loads_left = 0 // number of containers left to be loaded

        this.initial_loc = {location: 'bay', x: 9, y: 0} // initial location of crane
        this.final_loc = {location: 'bay', x: 9, y: 0}  // final location of crane
	}

    //function to check if two nodes are equal
    isEqual(other) 
    {
        return (this.checkStatesEqual(this.state, other.state) && this.unloads_left == other.unloads_left && this.loads_left == other.loads_left)
        //Note for later: maybe also check equality for initial_loc and final_loc
    }
    // use as ``node1.isEqual(node2)''

    //function to check if (thisNode's f is < otherNode's f)
    isLessThan(other)
    {
        if(this.f  == other.f)
        {
            return this.h < other.h
        }
        else
        {
            return this.f < other.f;
        }
    }
    //function to check if (thisNode's f is > otherNode's f)
    isGreaterThan(other)
    {
        if (this.f == other.f)
            return this.h > other.h
        else
            return this.f > other.f
    }

}

// GENERAL SEARCH ALGORITHM (searches for states, enqueues explored ones, checks if its final state )
function finalStateSearch(state) {
    
    if(list_of_unloads.length == 0)
    {
        if(list_of_loads.length == 0)
        {
            console.log(" --!!NOTHING TO LOAD/UNLOAD!!-- ")
            return
        }
        // else
        // {
        //     console.log(" -- LOADING CONTAINERS NOW -- ")
        // }
    }
    
    // returns instructions for fastest balance
    let initialNode = new Node(state)
    if(list_of_unloads.length!=0)
    {
        initialNode.unloads_left = list_of_unloads
    }
    if(list_of_loads!=0)
    {
        initialNode.loads_left = list_of_loads
    }

	// Create a data structure to store the paths that are being explored
	let frontier = [initialNode]

	// Create an empty data structure to store the explored paths
	let explored = []
	
    // While there are paths being explored
    while (frontier.length > 0) 
    {
        // Sort the paths in the frontier by f(g+h), with the lowest-cost paths first
        frontier.sort(
            function(a, b) {return (a.pathCost + a.heuristicCost) - (b.pathCost + b.heuristicCost)}
        )
        
        // Choose the lowest-cost path from the frontier
        let node = frontier.shift()

        explored.push(node) // Add this node to the explored paths
        
        // If this node reaches the goal, return the node 
        if (taskComplete(node.state)) 
        {
            console.log("SUCCESS! Instructions:")
            // return getInstructions(node)
        }

        // frontier = expand(frontier, explored, node)
    }

    // If there are no paths left to explore, return null to indicate that the goal cannot be reached
    console.log("ERROR: No Balance found!")
    return null //Should never reach here
}

function taskComplete(node) // returns true if no unloading/loading to be done
{
    if(node.loads_left == 0 && node.unloads_left.length == 0)
    {
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