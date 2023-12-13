import React, { Component } from 'react';
// import './tasks.css' 



// var numberOfContainers= 0;
class ToggleGrid extends Component 
{   
    
    state = {
        numberOfContainersToOffload: 0,
    }
    sendInputDataUp = (row,col) => {
        this.props.parentToggleButton({row, col});
    }
    showCellData = (row, col) =>
    {
        try {
            let gridCell = this.props.grid[row-1][col-1];
            document.getElementById('selectedButtonInfo').innerHTML="<h2>Cell Data</h2><p>Location: ["+row+", "+col+"]</p><p>Name: "+gridCell.container.name+"</p><p>Weight: "+gridCell.container.weight;
            
        } catch (error) {
        }
    }
    clearCellData = () =>
    {
        document.getElementById('selectedButtonInfo').innerHTML="<h2>Cell Data</h2>";

    }
    determineTypeOfCell = (row, col) =>
    {
        let gridCell = this.props.grid[row-1][col-1];
        if(gridCell.container === null && gridCell.deadSpace === true)
        {
            return (
                <>
                    <button
                         id={'toggleCell_['+row+','+col+']'}
                        className= 'gridCell gridToggleButton unusable'>
                    </button>
                </>
            );
        }
        else if(gridCell.container === null && gridCell.deadSpace === false)
        {
            // console.log(1);
            return (
                <>
                    <button
                        id={'toggleCell_['+row+','+col+']'}
                        className= 'gridCell gridToggleButton empty'>
    
                    </button>
                </>
            );
        }
        else if(gridCell.container !== null)
        {
            return (
                <>
                <button id={'toggleCell_['+row+','+col+']'} className={`gridCell gridToggleButton containerPresent ${gridCell.offload ? "active" : ""}`}
                        onMouseOver={() => this.showCellData(row, col)} onMouseLeave={()=>this.clearCellData} onClick={() => this.sendInputDataUp(row, col)}>
                    <span className='displayContainerName'>{gridCell.container.name}</span>
                </button>
                </>
            );
        }
    }
 
    render() {
 
        return (
         <div id="selectUnload" className='inputSection'>
            <h3 id="containersToUnloadInput_header">Select Containers to Unload</h3>
            <div id="OffloadCounter">Unloading {this.props.numberToOffload} containers</div>
            <div id="containersToUnloadInput">
                <div id="cargoGridDisplayContainer">
                    <div id='gridRow_8' className="gridRow">
                        <span className='label rowNumber'>8</span>
                        {this.determineTypeOfCell(8,1)}
                        {this.determineTypeOfCell(8,2)}
                        {this.determineTypeOfCell(8,3)}
                        {this.determineTypeOfCell(8,4)}
                        {this.determineTypeOfCell(8,5)}
                        {this.determineTypeOfCell(8,6)}
                        {this.determineTypeOfCell(8,7)}
                        {this.determineTypeOfCell(8,8)}
                        {this.determineTypeOfCell(8,9)}
                        {this.determineTypeOfCell(8,10)}
                        {this.determineTypeOfCell(8,11)}
                        {this.determineTypeOfCell(8,12)}
                    </div>
                    <div id='gridRow_7' className="gridRow">
                        <span className='label rowNumber'>7</span>
                        {this.determineTypeOfCell(7,1)}
                        {this.determineTypeOfCell(7,2)}
                        {this.determineTypeOfCell(7,3)}
                        {this.determineTypeOfCell(7,4)}
                        {this.determineTypeOfCell(7,5)}
                        {this.determineTypeOfCell(7,6)}
                        {this.determineTypeOfCell(7,7)}
                        {this.determineTypeOfCell(7,8)}
                        {this.determineTypeOfCell(7,9)}
                        {this.determineTypeOfCell(7,10)}
                        {this.determineTypeOfCell(7,11)}
                        {this.determineTypeOfCell(7,12)}
                    </div>
                    <div id='gridRow_6' className="gridRow">
                        <span className='label rowNumber'>6</span>
                        {this.determineTypeOfCell(6,1)}
                        {this.determineTypeOfCell(6,2)}
                        {this.determineTypeOfCell(6,3)}
                        {this.determineTypeOfCell(6,4)}
                        {this.determineTypeOfCell(6,5)}
                        {this.determineTypeOfCell(6,6)}
                        {this.determineTypeOfCell(6,7)}
                        {this.determineTypeOfCell(6,8)}
                        {this.determineTypeOfCell(6,9)}
                        {this.determineTypeOfCell(6,10)}
                        {this.determineTypeOfCell(6,11)}
                        {this.determineTypeOfCell(6,12)}

                    </div>
                    <div id='gridRow_5' className="gridRow">
                        <span className='label rowNumber'>5</span>
                        {this.determineTypeOfCell(5,1)}
                        {this.determineTypeOfCell(5,2)}
                        {this.determineTypeOfCell(5,3)}
                        {this.determineTypeOfCell(5,4)}
                        {this.determineTypeOfCell(5,5)}
                        {this.determineTypeOfCell(5,6)}
                        {this.determineTypeOfCell(5,7)}
                        {this.determineTypeOfCell(5,8)}
                        {this.determineTypeOfCell(5,9)}
                        {this.determineTypeOfCell(5,10)}
                        {this.determineTypeOfCell(5,11)}
                        {this.determineTypeOfCell(5,12)}
                    </div>
                    <div id='gridRow_4' className="gridRow">
                        <span className='label rowNumber'>4</span>
                        {this.determineTypeOfCell(4,1)}
                        {this.determineTypeOfCell(4,2)}
                        {this.determineTypeOfCell(4,3)}
                        {this.determineTypeOfCell(4,4)}
                        {this.determineTypeOfCell(4,5)}
                        {this.determineTypeOfCell(4,6)}
                        {this.determineTypeOfCell(4,7)}
                        {this.determineTypeOfCell(4,8)}
                        {this.determineTypeOfCell(4,9)}
                        {this.determineTypeOfCell(4,10)}
                        {this.determineTypeOfCell(4,11)}
                        {this.determineTypeOfCell(4,12)}
                    </div>
                    <div id='gridRow_3' className="gridRow">
                        <span className='label rowNumber'>3</span>
                        {this.determineTypeOfCell(3,1)}
                        {this.determineTypeOfCell(3,2)}
                        {this.determineTypeOfCell(3,3)}
                        {this.determineTypeOfCell(3,4)}
                        {this.determineTypeOfCell(3,5)}
                        {this.determineTypeOfCell(3,6)}
                        {this.determineTypeOfCell(3,7)}
                        {this.determineTypeOfCell(3,8)}
                        {this.determineTypeOfCell(3,9)}
                        {this.determineTypeOfCell(3,10)}
                        {this.determineTypeOfCell(3,11)}
                        {this.determineTypeOfCell(3,12)}
                    </div>
                    <div id='gridRow_2' className="gridRow">
                        <span className='label rowNumber'>2</span>
                        {this.determineTypeOfCell(2,1)}
                        {this.determineTypeOfCell(2,2)}
                        {this.determineTypeOfCell(2,3)}
                        {this.determineTypeOfCell(2,4)}
                        {this.determineTypeOfCell(2,5)}
                        {this.determineTypeOfCell(2,6)}
                        {this.determineTypeOfCell(2,7)}
                        {this.determineTypeOfCell(2,8)}
                        {this.determineTypeOfCell(2,9)}
                        {this.determineTypeOfCell(2,10)}
                        {this.determineTypeOfCell(2,11)}
                        {this.determineTypeOfCell(2,12)}
                    </div>
                    <div id='gridRow_1' className="gridRow">
                        <span className='rowNumber label'>1</span>
                        {/* <button id='[01,01]' className={this.determineTypeOfCell(1,1)}></button> */}
                        {this.determineTypeOfCell(1,1)}
                        {this.determineTypeOfCell(1,2)}
                        {this.determineTypeOfCell(1,3)}
                        {this.determineTypeOfCell(1,4)}
                        {this.determineTypeOfCell(1,5)}
                        {this.determineTypeOfCell(1,6)}
                        {this.determineTypeOfCell(1,7)}
                        {this.determineTypeOfCell(1,8)}
                        {this.determineTypeOfCell(1,9)}
                        {this.determineTypeOfCell(1,10)}
                        {this.determineTypeOfCell(1,11)}
                        {this.determineTypeOfCell(1,12)}
                    </div>

                    <div id="colNumbers">
                        <div className='label columnNumbers'>1</div>
                        <div className='label columnNumbers'>2</div>
                        <div className='label columnNumbers'>3</div>
                        <div className='label columnNumbers'>4</div>
                        <div className='label columnNumbers'>5</div>
                        <div className='label columnNumbers'>6</div>
                        <div className='label columnNumbers'>7</div>
                        <div className='label columnNumbers'>8</div>
                        <div className='label columnNumbers'>9</div>
                        <div className='label columnNumbers'>10</div>
                        <div className='label columnNumbers'>11</div>
                        <div className='label columnNumbers'>12</div>
                    </div>
                </div>
                <div id='selectedButtonInfo'>
                    <h2>Cell Data</h2>
                </div>
            </div>
         </div>   
        );
    }
}
 
export default ToggleGrid;