import React,{ Component } from 'react';
import '../tasks.css';
import FileUploader from '../fileUploader';
// import GridButton from './gridButton';

import Grid from './grid';

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

  let grid =
      [
        [{container: new Container("amazon warehous", 2432), deadSpace: 0}, {container: null, deadSpace: 1}, {container: null, deadSpace: 1}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}],
        [{container: new Container("WWWW", 5442)}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}],
        [{container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}],
        [{container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}],
        [{container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}],
        [{container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}],
        [{container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}],
        [{container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}],
        [{container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}, {container: null, deadSpace: 0}],//9th row
      ];

  

  class task1Loading extends Component {
    state = {
      // create starting state
      current: Task1_States.INIT,
      textFromFile: "null",
      loadedFileName: null,
      // grid: null


    };

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
          // console.log('_'+name+'_');
          if(name === 'UNUSED')
          {
            // alert(numbersFound);
            // alert(row_num + " " + col_num + " " + weight + " " + name);
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
        }
        // alert(inputLines.length);
        // alert(inputLines);

        this.transition(Task1_States.GRAB_INPUTS)
      } catch (error) {
        alert("ERROR: File not of correct format");
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
        <Grid toggle={1} grid={grid}/>
        {/* <Grid toggle={1} grid={grid}/> */}
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
    renderAllowInputs() 
    {
     
      return (
        <div>
          <div id='selectContianersFromGrid'>
            {/* Floor 1 */}
            <Grid toggle={1} grid={grid}/>
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