import React,{ Component } from 'react';
import '../tasks.css';
import FileUploader from '../fileUploader';

// Create States for State Machine Task1_States
  const Task1_States = {
    INIT: 0,              //where form will be uploaded
    // CONFIRM_FILE: 1,      //where form format will be checked and verifed
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

  

  class task1Loading extends Component {
    state = {
      // create starting state
      current: Task1_States.INIT,
      textFromFile: "null",
      grid: 
      [
        [null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null]//9th row
      ]
      // grid: null


    };

    handleFileCallback = (fileData) => {
      // Update the name in the component's state
      try {
        this.setState({ textFromFile: fileData });
        var inputLines = fileData.split('\n');
        for (var i = 0; i < inputLines.length; i++)
        {
          
          var numbersFound = inputLines[i].match(/(\d+)/g);
          var row_num = parseInt(numbersFound[0]);
          var col_num = parseInt(numbersFound[1]);
          var weight = parseInt(numbersFound[2]);
          var name = inputLines[i].substring(19);
          if(name != 'UNUSED')
          {
            // alert(numbersFound);
            // alert(row_num + " " + col_num + " " + weight + " " + name);
            this.state.grid[row_num][col_num] = new Container(name, weight);
          }
        }
        // alert(inputLines.length);
        // alert(inputLines);

        this.transition(Task1_States.GRAB_INPUTS)
      } catch (error) {
        alert("ERROR: File not of correct format" + error);
        this.transition(Task1_States.INIT);
      }
    }

    transition(to) {
      this.setState({current: to});
    }
    // define what is shown at each state
    render() {
      switch(this.state.current) {
        // case Task1_States.CONFIRM_FILE:
        //   return this.renderConfirmFile();
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
    renderInit() {
      return (
      <div>
        <FileUploader parentCallback={this.handleFileCallback}/>
      </div>
      );
      
    }
    // logic for the confirm file
    // renderConfirmFile() {
    //   return (
    //     <button onClick={() => this.transition(Task1_States.GRAB_INPUTS)}>
    //       Go to state 3
    //     </button>
    //   );
    // }
    // logic for the allowing inputs
    renderAllowInputs() {
      return (
        <button onClick={() => this.transition(Task1_States.INIT)}>
          In the grab input state
        </button>
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