import React,{ Component } from 'react';
import '../tasks.css';
import FileUploader from '../fileUploader';
import ToggleGrid from './toggleGrid';

import {saveEvent } from '../../logFile'

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
  let LocalNumberToOffload = 0;

  class task1Loading extends Component {
    state = {
      // create starting state
      current: Task1_States.INIT,
      textFromFile: "null",
      loadedFileName: null,
      gridState: grid,
      offloadStateCounter: LocalNumberToOffload,
      addContainersState: false,
    };

    handleNewContainers = (containerArray) => {
      containersToLoad = (containerArray);
      this.setState({addContainersState: !this.state.addContainersState});
      console.log(containerArray);
    };

    handleButtonToggle = (coord) => {
      grid[coord.row-1][coord.col-1].offload = !(grid[coord.row-1][coord.col-1].offload); 
      if(grid[coord.row-1][coord.col-1].offload === true)
        LocalNumberToOffload += 1;
      else if(grid[coord.row-1][coord.col-1].offload === false)
        LocalNumberToOffload -= 1;
      this.setState({gridState: grid, offloadStateCounter: LocalNumberToOffload});
    };
    handleFileCallback = (data) => {
      // Update the name in the component's state
      try {
        let count = 0;
        let fileData = data.text;
        this.setState({ textFromFile: fileData, loadedFileName: data.name });
        var inputLines = fileData.split('\n');
        for (var i = 0; i < inputLines.length; i++)
        {
          
          var numbersFound = inputLines[i].match(/(\d+)/g);
          var row_num = parseInt(numbersFound[0])-1;
          var col_num = parseInt(numbersFound[1])-1;
          var weight = parseInt(numbersFound[2]);
          // var name = inputLines[i].substring(19).trim();
          var name = inputLines[i].replace(/^(?:[^,]*,){2}[^,]*,/, ' ').trim();
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
            count++;
          }
          this.setState({gridState: grid});
        }
        saveEvent("Manifest " + data.name + " is opened. There are " + count + " container(s) on the ship");
        this.transition(Task1_States.GRAB_INPUTS)
      } catch (error) {
        // alert("File is of the incorrect manifest format and cannot be read");
        alert(error);
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
          <FileUploader parentCallback={this.handleFileCallback}/>
        </div>
      );
      
    }  
    // logic for the allowing inputs
    renderAllowInputs() 
    {
      
      return (
        <div>
            <div id="loadUnloadInputs" className='page'>
              <AddContainers parentAddContainers={this.handleNewContainers} />
              <ToggleGrid parentToggleButton={this.handleButtonToggle} numberToOffload={LocalNumberToOffload} grid={grid}/>
              <div id="submitInputsSection" className='inputSection'>
                <h3 id="submitInputsHeader">Ready to Continue: </h3>
                <button id="submitInputs" onClick={() => this.transition(Task1_States.COMPUTE_STEPS)}>
                  Compute Steps
                </button>
              </div>
            </div>
          </div>


      //  </div> 
      );
    }
    // #TODO: #3 logic for Computeing the steps (where our search function is going to go) 
    renderComputeSteps() {
      return (
        <button onClick={() => this.transition(Task1_States.INIT)}>
          No Logic Yet
          {console.log(grid)}
          {console.log(containersToLoad)}
        </button>
      );
    }
    // logic for showing steps
    renderShowSteps() {
      return (
        <button onClick={() => this.transition(Task1_States.INIT)}>
          Currently computing steps 
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