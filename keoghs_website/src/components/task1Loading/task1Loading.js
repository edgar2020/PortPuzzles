import React,{ Component, useState } from 'react';
import '../tasks.css';
import FileUploader from '../fileUploader';
import ToggleGrid from './toggleGrid';
import AddContainers from './addContainers';

// Create States for State Machine Task1_States
  const Task1_States = {
    INIT: 0,              //where form will be uploaded
    GRAB_INPUTS: 1,       //where inputs from operator are given
    COMPUTE_STEPS: 2,     //where the program begins calculating a sequence of moves
    DISPLAY_STEPS: 3,     //where steps are displayed
    FINISH_PROCEDURE: 4   //where new manifest is made, downloaded and reminder sent
  };
  class Container {
    constructor(name, weight) {
      this.name = name;
      this.weight = weight;
    }
  }

  let grid =
      [
        [ {container: new Container("amazon warehous", 2432), deadSpace: 0, offload:false}, {container: null, deadSpace: 1}, {container: null, deadSpace: 1}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}],
        [ {container: new Container("THIS STRING here", 5442), deadSpace: 0, offload: true}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}],
        [ {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}],
        [ {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}],
        [ {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}],
        [ {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}],
        [ {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}],
        [ {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}],
        [ {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}],//9th row
      ];
  let containersToLoad = [];

  class task1Loading extends Component {
    state = {
      // create starting state
      current: Task1_States.INIT,
      textFromFile: "null",
      loadedFileName: null,
      gridState: grid,
      addContainersState: false,
    };

    handleNewContainers = (containerArray) => {
      containersToLoad = (containerArray);
      this.setState({addContainersState: !this.state.addContainersState});
      console.log(containerArray);
    }

    handleButtonToggle = (coord) => {
      grid[coord.row-1][coord.col-1].offload = !(grid[coord.row-1][coord.col-1].offload); 
      this.setState({gridState: grid});
    }
    handleFileCallback = (data) => {
      // Update the name in the component's state
      try {
        let fileData = data.text;
        this.setState({ textFromFile: fileData, loadedFileName: data.name });
        var inputLines = fileData.split('\n');
        for (var i = 0; i < inputLines.length; i++)
        {
          
          var numbersFound = inputLines[i].match(/(\d+)/g);
          var row_num = parseInt(numbersFound[0])-1;
          var col_num = parseInt(numbersFound[1])-1;
          var weight = parseInt(numbersFound[2]);
          var name = inputLines[i].substring(19).trim();
          if(name === 'UNUSED')     
          {
            grid[row_num][col_num] = {container: null, deadSpace: 0};
          }
          else if(name === 'NAN')
          {
            grid[row_num][col_num] = {container: null, deadSpace: 1};
          }
          else
          {
            grid[row_num][col_num] = {container: new Container(name, weight), deadSpace: 0, offload: 0};
          }
          this.setState({gridState: grid});
        }

        this.transition(Task1_States.GRAB_INPUTS)
      } catch (error) {
        this.transition(Task1_States.INIT);
      }
    }

    transition(to) {
      this.setState({current: to});
    }
    // define what is shown at each state
    render() {
      switch(this.state.current) {
        case Task1_States.GRAB_INPUTS:
          return this.renderAllowInputs();
          case Task1_States.COMPUTE_STEPS:
            return this.renderComputeSteps();
        case Task1_States.DISPLAY_STEPS:
          return this.renderShowSteps();
          case Task1_States.FINISH_PROCEDURE:
          return this.renderFinishProcedure();
          case Task1_States.INIT:
        default:
          return this.renderInit();
        }
      }
      renderInit() 
      {
        return (
          <div>
          <AddContainers parentToggleButton={this.handleNewContainer} />
          <FileUploader parentCallback={this.handleFileCallback}/>
        </div>
      );
      
    }  
    // logic for the allowing inputs
    renderAllowInputs() 
    {
      
      return (
        <div>
            {/* <AddContainers parentToggleButton={this.handleNewContainer} /> */}
          <div id='selectContianersFromGrid'>
            <ToggleGrid parentToggleButton={this.handleButtonToggle} grid={grid}/>
          </div>


          <button onClick={() => this.transition(Task1_States.INIT)}>
            In the grab input state
          </button>
        </div>
      );
    }
    // #TODO: #3 logic for Computeing the steps (where our search function is going to go) 
    renderComputeSteps() {
      return (
        <button onClick={() => this.transition(Task1_States.INIT)}>
          No Logic Yet
        </button>
      );
    }
    // logic for showing steps
    renderShowSteps() {
      return (
        <button onClick={() => this.transition(Task1_States.INIT)}>
          No Logic Yet
        </button>
      );
    }
    // logic for the finish procedure
    renderFinishProcedure() {
      return (
        <button onClick={() => this.transition(Task1_States.INIT)}>
          No Logic Yet
        </button>
      );
    }
  }

  export default task1Loading;