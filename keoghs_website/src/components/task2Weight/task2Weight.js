import React,{ Component } from 'react';
import '../../css/tasks.css';
import FileUploader from '../fileUploader';
import ComputeSteps from './balancingSearchAlgorithm';
import DisplaySteps from '../displaySteps';
import {saveEvent } from '../../logFile'

// Create States for State Machine Task2_States
const Task2_States = {
  INIT: 0,              //where form will be uploaded
  COMPUTE_STEPS: 1,     //where the program begins calculating a sequence of moves
  DISPLAY_STEPS: 2,     //where steps are displayed
  FINISH_PROCEDURE: 3   //where new manifest is made, downloaded and reminder sent
};

// defines an object for containers thats easy to call
class Container {
  constructor(name, weight) {
    this.name = name;
    this.weight = weight;
  }
}

// global variable that keep tracks of the current grid of the ship
let grid =
      [
        [ {container: new Container("amazon warehous", 100), deadSpace: false}, {container: null, deadSpace: true}, {container: null, deadSpace: true}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],
        [ {container: new Container("THIS STRING here", 90), deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],
        [ {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],
        [ {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],
        [ {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],
        [ {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],
        [ {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],
        [ {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],
        [ {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],//9th row
      ];
// let grid2 =
//       [
//         [ {container: new Container("amazon warehous", 100), deadSpace: false}, {container: null, deadSpace: true}, {container: null, deadSpace: true}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],
//         [ {container: new Container("THIS STRING here", 90), deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],
//         [ {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],
//         [ {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],
//         [ {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],
//         [ {container: new Container("aasdfhs", 235), deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],
//         [ {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],
//         [ {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],
//         [ {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],//9th row
//       ];

      // let buffer =
      // [
      //   [ {container: new Container("THIS STRING here", 90), deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: new Container("amazon warehous", 100), deadSpace: false}, {container: null, deadSpace: true}, {container: null, deadSpace: true}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],
      //   [ {container: new Container("THIS STRING here", 90), deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: new Container("amazon warehous", 100), deadSpace: false}, {container: null, deadSpace: true}, {container: null, deadSpace: true}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],
      //   [ {container: new Container("THIS STRING here", 90), deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: new Container("amazon warehous", 100), deadSpace: false}, {container: null, deadSpace: true}, {container: null, deadSpace: true}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],
      //   [ {container: new Container("THIS STRING here", 90), deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: new Container("amazon warehous", 100), deadSpace: false}, {container: null, deadSpace: true}, {container: null, deadSpace: true}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}, {container: null, deadSpace: false}],
      // ];

      // let practiceSteps = 
      // [
      //   {cost: 14, state:{ship: grid, buffer: buffer},initialPos:{position: [2, 1], location: 1}, finalPos: {position: [1, 1], location: 3} }, 
      //   {cost: 4, state:{ship: grid2, buffer: buffer},initialPos:{position: [1, 1], location: 1}, finalPos: {position: [2, 2], location: 2} }, 
      //   {cost: 1, state:{ship: grid2, buffer: buffer},initialPos:{position: [1, 1], location: 1}, finalPos: {position: [2, 2], location: 1} }, 
      // ]

let steps = null;
class task2Loading extends Component {
  state = {
    current: Task2_States.INIT, // Current: (enum) Keep tracks of the current state in the FSM
    textFromFile: "null",       // textFromFile: (string) contains the text of whatever file is currently loaded
    loadedFileName: null,       // loadedFileName: name of the file currenly being used
    gridState: [],              // used to send an update to the component whenever grid updates
    stepsFound: null            // (array of obj) steps that have been found
  };

  /** 
   * handleCallback:
   *  @param fileData (string) all the text from inside the txt file passed in
   *  the function is called from a child component named FileIpload.js in which
   *  the contents of a txt file is sent up the the parent component in charge 
   *  of organizing the task. The fucniton then updates the grid if the file
   *  is of correct format or returns an error if the file could not be read 
   *  properly. If the file was read sucessfuly, the page transitions to the
   *  next state
 **/
  handleFileCallback = (fileData) => {
      try {
        let count = 0;
        this.setState({ textFromFile: fileData.text, loadedFileName: fileData.name });
        var inputLines = fileData.text.split('\n');
        for (var i = 0; i < inputLines.length; i++)
        {
          var numbersFound = inputLines[i].match(/(\d+)/g);
          var row_num = parseInt(numbersFound[0])-1;
          var col_num = parseInt(numbersFound[1])-1;
          var weight = parseInt(numbersFound[2]);
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
            grid[row_num][col_num] = {container: new Container(name, weight), deadSpace: false};
            count++;
          }
        }
        for(var i = 0; i < 12; i++)
        {
          grid[8][i] = {container: null, deadSpace: false};
        }
        this.setState({gridState: grid});
        // alert(inputLines.length);
        // alert(inputLines);
        saveEvent("Manifest " + fileData.name + " is opened. There are " + count + " container(s) on the ship");
        this.transition(Task2_States.COMPUTE_STEPS)
      } catch (error) {
        alert("ERROR: File not of correct format" + error);
        this.transition(Task2_States.INIT);
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
      this.transition(Task2_States.DISPLAY_STEPS);
    }

    
    // stepsHaveFinished = () =>
    // {
    //   // this.setState({steps: s});
    //   console.log(s);
    //   this.transition(Task2_States.Init);
    // }
 /** 
   * transition:
   *  @param to (state) 
   * causes the FSM to transition to whichever state is passed in
 **/
  transition(to) {
    this.setState({current: to});
  }
  render() {
    // define what is shown at each state
    switch(this.state.current) {
      case Task2_States.COMPUTE_STEPS:
        return this.renderComputeSteps();
      case Task2_States.DISPLAY_STEPS:
        return this.renderShowSteps();
        case Task2_States.FINISH_PROCEDURE:
        return this.renderFinishProcedure();
        case Task2_States.INIT:
          default:
            return this.renderInit();
    }
  }
  // renders the Init aka initial state
  renderInit() {
    return (
      <div className='page'>
        {/* <DisplaySteps steps={practiceSteps}/> */}
      <FileUploader parentCallback={this.handleFileCallback}/>
    </div>
    );
    
  }  
  // renders the state in which the states are computed
  renderComputeSteps() {
    return (
      <>
        <ComputeSteps parentRecieveSteps={this.recieveSteps} grid={grid} />
      </>
    );
  }
  // renders the state that shows the steps
  renderShowSteps() {
    // console.log(this.state.loadedFileName);
    return (
      <>
        {/* {console.log("fs")}
        {console.log(this.state.stepsFound)} */}
        <div className='loadedFileName'>Current File: {this.state.loadedFileName}</div>
        <DisplaySteps fileName={this.state.loadedFileName} steps={steps} task={2} />
      {/* <button onClick={() => this.transition(Task2_States.INIT)}>
        No Logic Yetd
      </button> */}
      </>
    );
  }
  // renders the logic for the finish procedure
  renderFinishProcedure() {
    return (
      <button onClick={() => this.transition(Task2_States.INIT)}>
        No Logic Yet
      </button>
    );
  }
}

export default task2Loading;