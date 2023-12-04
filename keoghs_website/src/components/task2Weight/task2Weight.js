import React,{ Component } from 'react';
import '../tasks.css';
import FileUploader from '../fileUploader';
import { balance } from './balancingSearchAlgorithm';

// Create States for State Machine Task2_States
  const Task2_States = {
    INIT: 0,              //where form will be uploaded
    // CONFIRM_FILE: 1,      //where form format will be checked and verifed
    // GRAB_INPUTS: 1,       //where inputs from operator are given
    COMPUTE_STEPS: 1,     //where the program begins calculating a sequence of moves
    DISPLAY_STEPS: 2,     //where steps are displayed
    FINISH_PROCEDURE: 3   //where new manifest is made, downloaded and reminder sent
  };
  class Container {
    constructor(name, weight) {
      this.name = name;
      this.weight = weight;
    }
  }

  let grid =
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
      ];

  class task2Loading extends Component {
    state = {
      // create starting state
      current: Task2_States.INIT,
      textFromFile: "null",
      loadedFileName: null,
        gridState: []
    };

    handleFileCallback = (fileData) => {
        // Update the name in the component's state
        try {
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
            grid[row_num][col_num] = {container: null, deadSpace: 0};
          }
          else if(name === 'NAN')
          {
            grid[row_num][col_num] = {container: null, deadSpace: 1};
          }
          else
          {
            grid[row_num][col_num] = {container: new Container(name, weight), deadSpace: 0};
          }
          for(var i = 0; i < 12; i++)
          {
            grid[8][i] = {container: null, deadSpace: 0};
          }
          this.setState({gridState: grid});
          // alert(inputLines.length);
          // alert(inputLines);
  
          this.transition(Task2_States.COMPUTE_STEPS)
        } catch (error) {
          alert("ERROR: File not of correct format" + error);
          this.transition(Task2_States.INIT);
        }
      }

    transition(to) {
      this.setState({current: to});
    }
    // define what is shown at each state
    render() {
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
    renderInit() {
      return (
      <div className='page'>
        <FileUploader parentCallback={this.handleFileCallback}/>
      </div>
      );
      
    }  
    // #TODO: #3 logic for Computeing the steps (where our search function is going to go) 
    renderComputeSteps() {
      console.log(balance(grid)); // Calling the balancing function for testing purposes
      return (
        <button onClick={() => this.transition(Task2_States.INIT)}>
          No Logic Yet
        </button>
      );
    }
    // logic for showing steps
    renderShowSteps() {
      return (
        <button onClick={() => this.transition(Task2_States.INIT)}>
          No Logic Yet
        </button>
      );
    }
    // logic for the finish procedure
    renderFinishProcedure() {
      return (
        <button onClick={() => this.transition(Task2_States.INIT)}>
          No Logic Yet
        </button>
      );
    }
  }

  export default task2Loading;