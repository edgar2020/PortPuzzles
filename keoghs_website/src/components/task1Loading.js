import React,{ Component } from 'react';
import './tasks.css';

// Create States for State Machine Task1_States
const Task1_States = {
    INIT: 0,              //where form will be uploaded
    CONFIRM_FILE: 1,      //where form format will be checked and verifed
    GRAB_INPUTS: 2,       //where inputs from operator are given
    COMPUTE_STEPS: 3,     //where the program begins calculating a sequence of moves
    DISPLAY_STEPS: 4,     //where steps are displayed
    FINISH_PROCEDURE: 5   //where new manifest is made, downloaded and reminder sent
  };
  class task1Loading extends Component {
    state = {
      // create starting state
      current: Task1_States.INIT
      
    };
    transition(to) {
      this.setState({current: to});
    }
    // define what is shown at each state
    render() {
      switch(this.state.current) {
        case Task1_States.CONFIRM_FILE:
          return this.renderConfirmFile();
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
      // logic for the file upload
      return (
        <button onClick={() => this.transition(Task1_States.CONFIRM_FILE)}>
          Go to state 2
        </button>
      );
    }
    // logic for the confirm file
    renderConfirmFile() {
      return (
        <button onClick={() => this.transition(Task1_States.GRAB_INPUTS)}>
          Go to state 3
        </button>
      );
    }
    // logic for the allowing inputs
    renderAllowInputs() {
      return (
        <button onClick={() => this.transition(Task1_States.INIT)}>
          Go back to the initial state
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