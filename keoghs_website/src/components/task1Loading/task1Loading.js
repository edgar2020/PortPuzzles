import React,{ Component } from 'react';
import '../../css/tasks.css';
import FileUploader from '../fileUploader';
import ToggleGrid from './toggleGrid';
import ComputeSteps from './load_unload';

import DisplaySteps from '../displaySteps';

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
  // let grid =
  // [
  //   [ {container: new Container("A", 2432), deadSpace: false, offload:true}, {container: new Container("J", 5442), deadSpace: false, offload: true}, {container: null, deadSpace: true}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: new Container("Q", 2432), deadSpace: false, offload:false}],
  //   [ {container: new Container("B", 5442), deadSpace: false, offload: false}, {container: new Container("K", 5442), deadSpace: false, offload: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: new Container("R", 2432), deadSpace: false, offload:false}],
  //   [ {container: new Container("C", 5442), deadSpace: false, offload: false}, {container: new Container("L", 5442), deadSpace: false, offload: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: new Container("S", 2432), deadSpace: false, offload:false}],
  //   [ {container: new Container("D", 5442), deadSpace: false, offload: false}, {container: new Container("M", 5442), deadSpace: false, offload: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: new Container("T", 2432), deadSpace: false, offload:false}],
  //   [ {container: new Container("E", 5442), deadSpace: false, offload: false}, {container: new Container("N", 5442), deadSpace: false, offload: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: new Container("U", 2432), deadSpace: false, offload:false}],
  //   [ {container: new Container("F", 5442), deadSpace: false, offload: false}, {container: new Container("O", 5442), deadSpace: false, offload: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: new Container("V", 2432), deadSpace: false, offload:false}],
  //   [ {container: new Container("G", 5442), deadSpace: false, offload: false}, {container: new Container("P", 5442), deadSpace: false, offload: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: new Container("W", 2432), deadSpace: false, offload:false}],
  //   [ {container: new Container("H", 5442), deadSpace: false, offload: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: new Container("X", 2432), deadSpace: false, offload:false}],
  //   [ {container: new Container("I", 5442), deadSpace: false, offload: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: new Container("Y", 2432), deadSpace: false, offload:false}] //9th row
  // ];
  let grid =
      [
        [ {container: new Container("amazon warehous", 2432), deadSpace: false, offload:true}, {container: null, deadSpace: false}, {container: null, deadSpace: true}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],
        [ {container: new Container("THIS STRING here", 5442), deadSpace: false, offload: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],
        [ {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],
        [ {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],
        [ {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],
        [ {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],
        [ {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],
        [ {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],
        [ {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],//9th row
      ];
    let steps = null;
  // let containersToLoad = [new Container("AA", null)];
  // let containersToLoad = [new Container("AA", null), new Container("BB", null), new Container("CC", null)];
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
      stepsFound: null            // (array of obj) steps that have been found
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
            grid[row_num][col_num] = {container: null, deadSpace: false};
          }
          else if(name === 'NAN')
          {
            grid[row_num][col_num] = {container: null, deadSpace: true};
          }
          else
          {
            grid[row_num][col_num] = {container: new Container(name, weight), deadSpace: false, offload: false};
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
    /**
     * recieveSteps:
     */
    recieveSteps = (s) =>
    {
      steps = s.steps;
      this.setState({steps: s});
      console.log(steps);
      this.transition(Task1_States.DISPLAY_STEPS);
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
          {/* <ComputeSteps parentRecieveSteps={this.recieveSteps} load = {containersToLoad} grid={grid} />
          <ToggleGrid parentToggleButton={this.handleButtonToggle} numberToOffload={LocalNumberToOffload} grid={grid}/> */}
          <FileUploader parentCallback={this.handleFileCallback}/>
        </div>
      );
      
    }  
    // logic for the allowing inputs
    renderAllowInputs() 
    {
      
      return (
        <div>
          
            <div className='loadedFileName'>Current File: {this.state.loadedFileName}</div>
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
            <br/>
            <br/>
            <br/>
          </div>
      );
    }
    // #TODO: #3 logic for Computeing the steps (where our search function is going to go) 
    renderComputeSteps() {
      return (
        <>
          <ComputeSteps parentRecieveSteps={this.recieveSteps} load = {containersToLoad} grid={grid} />
        </>
      );
    }
    // logic for showing steps
    renderShowSteps() {
      return (
       <>
          <DisplaySteps fileName={this.state.loadedFileName} steps={steps} task={1}/>
        </>
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