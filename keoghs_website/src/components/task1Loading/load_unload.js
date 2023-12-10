import React, { useEffect, useState, Component } from 'react';

// function to print a State or 2D array of ship
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

//function to print a Node
function show_Node(node)
{
    let s= "";
    s += "G: " + node.pathCost;
    s += "\tH: " + node.heuristicCost;
    s += "\tF: " + node.f;
    
    // consolePrintState(node.state)
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

        // Added buffer state
		this.bufferState = structuredClone(buffer) // Buffer for the array
		this.pathCost = 0
		this.heuristicCost = 0

        // on;y needed for sort and sort is already using p+h
        // this.f = this.pathCost + this.heuristicCost // f = g+h
        
		this.parent = null // copy of previous Node

        this.unloads_left = [] // list of containers coordinates left to be unloaded
        // changed loads_left to be an array of containers that still need to be offloaded
        // that way it will be easier to copy container data to the ship
        this.loads_left = [] // list of containers left to be loaded
        // location: '1' if ship, '2' if buffer, '3' if truck, also changed format to better mimic adolfos
        this.initial_loc = {location: '1', pos: [9, 0]} // initial location of crane
        this.final_loc = {location: '1', pos: [9,0]}  // final location of crane
	}

    //function to check if two nodes are equal
    isEqual(other) 
    {
        // TODO: are the load_left and loads_unleft really necessary? And differences will already be visible when you checkStatesEqual 
        return (checkStatesEqual(this.shipState, other.shipState) && this.unloads_left == other.unloads_left && this.loads_left == other.loads_left)
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
function finalStateSearch(shipState, loads, unloads) {
    console.log("Starting algo");
    
    // condition where no steps necessary (working)
    if(unloads.length == 0 && loads.length == 0)
    {
            console.log(" --!!NOTHING TO LOAD/UNLOAD!!-- ")
            // TODO add return object here
            return
    }
    
    // returns instructions for fastest load/unload
    // TODO add buffer instead of []
    let initialNode = new Node(shipState, [])

    // hash map for repeated states
    mapStates.set(initialNode.shipState, initialNode);
    
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
            // return getInstructions(node)
        }

        frontier = expand(frontier, explored, curr_node)
    }

    // If there are no paths left to explore, return null to indicate that the goal cannot be reached
    console.log("ERROR: No paths left to explore found!")
    return null //Should never reach here
}

function expand(frontier, explored, node) { // branching function, max 12x11 branches
    console.log("EXPANDING NODE")

    // TODO: look at the columns of all containers to remove (coordinates are NOT 0 indexed)
    // TODO: Look at columns with container to be remove - move to truck (if removable),move to other column, move to buffer,
    // TODO: Load Container onto ship in a column that does not have a container to be removeed
    let columns_With_ContainersToRemove = []; 
    // find all columns with containers to remove
    for(var i = 0; i < node.unloads_left.length; i++)
    {
        columns_With_ContainersToRemove.push(node.unloads_left[i][0]);
    }
    // remove duplicates columns
    columns_With_ContainersToRemove = [... new Set(columns_With_ContainersToRemove)]
    let columns_Without_ContainersToRemove = [1,2,3,4,5,6,7,8,9,10,11,12].filter(x => !columns_With_ContainersToRemove.includes(x));
    // console.log(columns_With_ContainersToRemove)
    // console.log(columns_Without_ContainersToRemove)
    
    // for every column with container to remove
        // find the container at the very top
            // if it needs to go to the truck
                // create a new node where the container was moved to a new truck
            // else (it does not need to be removed)
                // do something
                // create a node for every column where the container is not currently in
                // TODO: currently not considereing the buffer
    // if containers to load
        // for every available column
            // create a node where the container is moved to that column


    
    return frontier
}

function taskComplete(node) // returns true if no unloading/loading to be done
{
    if(node.loads_left.length === 0 && node.unloads_left.length === 0)
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

async function main(shipState, load_list)
{
    // load list porperly loaded 
        // console.log("Load List: ");
        // console.log(load_list);
    // Ship state properly loaded
        // console.log("Ship: ");
        // console.log(shipState);
    // list_of_loads properly assigned
    // console.log("READING CONTAINERS TO UNLOAD")
    // list_of_loads = load_list;
    for(let i=0; i< rows-1; i++)
    {
        for(let j=0; j<cols; j++)
        {
            if(shipState[i][j].offload == true)
            {
                // console.log("i: "+i,"j: "+j)
                // console.log(shipState[i][j].container)
                list_of_unloads.push([i+1, j+1])
            }
        }
    }
    // console.log(list_of_unloads);
    finalStateSearch(shipState, load_list, list_of_unloads)
    
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
    }, []);
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