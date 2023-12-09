import React, {useState, useEffect} from 'react';
import '../css/displaySteps.css'

import {saveEvent } from '../logFile'
// import '../css/tasks.css'

const Step = ({index, cost, initialPos, finalPos, state, stepIndex, length, fileName}) => {
    {/* {cost: 14, state:{ship: grid, buffer: buffer},initialPos:{position: [1, 1], location: 1}, finalPos: {position: [1, 1], location: 12} },  */}
    function determineTypeOfCell (loc, row, col) 
    {
        let section = 0;
        if(loc === 1)
        {
            section = state.ship;
        } 
        else if(loc === 2)
        {
            section = state.buffer;
        } 
        else
        {
            let end = (loc === finalPos.location);
            return (
                <>
                    <button
                        id={'toggleCell_['+row+','+col+']'}
                        className= {`displayCell gridToggleButton empty ${end ? " end " : ""}`}>
                    </button>
                </>
            );
        }
        let displayCell = section[row-1][col-1];
        if(displayCell.container === null && displayCell.deadSpace === true)
        {
            return (
                <>
                    <button
                         id={'toggleCell_['+row+','+col+']'}
                        className= 'displayCell gridToggleButton unusable'>
                    </button>
                </>
            );
        }
        else if(displayCell.container === null && displayCell.deadSpace === false)
        {   
            let end = (row-1 === finalPos.pos[0] && col-1 === finalPos.pos[1] && loc === finalPos.loc );
            return (
                <>
                    <button
                        id={'toggleCell_['+row+','+col+']'}
                        className= {`displayCell gridToggleButton empty ${end ? " end " : ""}`}>
                    </button>
                </>
            );
        }
        else if(displayCell.container !== null)
        {
            let start = ((row-1) === initialPos.pos[0] && (col-1) === initialPos.pos[1] && loc === initialPos.loc);
            return (
                <>
                <button id={'toggleCell_['+row+','+col+']'} className={`displayCell gridToggleButton containerPresent ${start ? " start " : ""}`}>
                    {displayCell.container.weight}
                </button>
                </>
            );
        }
    }

    let position = "nonActive";
    if(stepIndex === index){
       position = 'activeSlide'
      }
      
      const downloadOutBoundManifest = () => {
        let generatedText = "";
        for(var rowNum = 0; rowNum < 8; rowNum++)
        {
            for(var colNum = 0; colNum < 12; colNum++)
            {
                let disp_row = "0"+(rowNum+1); 
                let disp_col = ((colNum+1 < 10) ? '0' : '')+(colNum+1); 
                
                let cell = state.ship[rowNum][colNum];
                if(cell.container === null && cell.deadSpace===false)
                {
                    generatedText += ("["+disp_row+","+disp_col+"], {00000}, UNUSED\n");
                }
                else if(cell.container === null && cell.deadSpace===true)
                {
                    generatedText += ("["+disp_row+","+disp_col+"], {00000}, NAN\n");
                }
                else
                {
                    let weight = cell.container.weight.toString();
                    while (weight.length < 5) weight = "0" + weight;
                    generatedText += ("["+disp_row+","+disp_col+"], {"+weight+"}, "+cell.container.name+"\n");
                }
            }
        }
        const element = document.createElement("a");
        const file = new Blob([generatedText],    
            {type: 'text/plain;charset=utf-8'});
            element.href = URL.createObjectURL(file);
            let downloadFileName = fileName.replace(".txt", "")+"_OUTBOUND"+".txt";
            element.download = downloadFileName;
            document.body.appendChild(element);
            element.click();
            saveEvent("Finished a Cycle. Manifest "+downloadFileName+" was downloaded, and a reminder pop-up to operator to send the file was displayed.");
        window.location.href="/";
      }
    

      const generateInfoBox = () =>
      {
        if(length-1 === index){
            // document.getElementById('nextStepButton').style.visibility  = 'hidden';
            return(
                <div>
                    <h3>Task Completed:</h3>
                    Remember to download the OutBound Manifest and email it to the ship captain:
                    <button onClick={downloadOutBoundManifest}>Download File</button>
                </div>
            )
        }
        else
        {
            return(
                <>
                    <h3>Information:</h3>
                    <p>Time Remaining: {cost}</p>
                    <p>Step: {index+1} of {length-1}</p>
                </>
            )
        }
          
      }
     return(
        <div className={"individualStepContainerOuter " + position}>
            
            <div className={"individualStepContainerInner"}>
                
                <div className='buffer'>
                    <div className='statsContainer'>
                        <div className='statsContainerInner'>
                              {generateInfoBox()}
                        </div>
                    </div>
                    <div id='bufferRow_4' className="bufferRow">
                                <span className='label rowNumber'>4</span>
                                {determineTypeOfCell(2,4,1)}
                                {determineTypeOfCell(2,4,2)}
                                {determineTypeOfCell(2,4,3)}
                                {determineTypeOfCell(2,4,4)}
                                {determineTypeOfCell(2,4,5)}
                                {determineTypeOfCell(2,4,6)}
                                {determineTypeOfCell(2,4,7)}
                                {determineTypeOfCell(2,4,8)}
                                {determineTypeOfCell(2,4,9)}
                                {determineTypeOfCell(2,4,10)}
                                {determineTypeOfCell(2,4,11)}
                                {determineTypeOfCell(2,4,12)}
                                {determineTypeOfCell(2,4,13)}
                                {determineTypeOfCell(2,4,14)}
                                {determineTypeOfCell(2,4,15)}
                                {determineTypeOfCell(2,4,16)}
                                {determineTypeOfCell(2,4,17)}
                                {determineTypeOfCell(2,4,18)}
                                {determineTypeOfCell(2,4,19)}
                                {determineTypeOfCell(2,4,20)}
                                {determineTypeOfCell(2,4,21)}
                                {determineTypeOfCell(2,4,22)}
                                {determineTypeOfCell(2,4,23)}
                                {determineTypeOfCell(2,4,24)}
                    </div>
                    <div id='bufferRow_3' className="bufferRow">
                                <span className='label rowNumber'>3</span>
                                {determineTypeOfCell(2,3,1)}
                                {determineTypeOfCell(2,3,2)}
                                {determineTypeOfCell(2,3,3)}
                                {determineTypeOfCell(2,3,4)}
                                {determineTypeOfCell(2,3,5)}
                                {determineTypeOfCell(2,3,6)}
                                {determineTypeOfCell(2,3,7)}
                                {determineTypeOfCell(2,3,8)}
                                {determineTypeOfCell(2,3,9)}
                                {determineTypeOfCell(2,3,10)}
                                {determineTypeOfCell(2,3,11)}
                                {determineTypeOfCell(2,3,12)}
                                {determineTypeOfCell(2,3,13)}
                                {determineTypeOfCell(2,3,14)}
                                {determineTypeOfCell(2,3,15)}
                                {determineTypeOfCell(2,3,16)}
                                {determineTypeOfCell(2,3,17)}
                                {determineTypeOfCell(2,3,18)}
                                {determineTypeOfCell(2,3,19)}
                                {determineTypeOfCell(2,3,20)}
                                {determineTypeOfCell(2,3,21)}
                                {determineTypeOfCell(2,3,22)}
                                {determineTypeOfCell(2,3,23)}
                                {determineTypeOfCell(2,3,24)}
                    </div>
                    <div id='bufferRow_2' className="bufferRow">
                                <span className='label rowNumber'>2</span>
                                {determineTypeOfCell(2,2,1)}
                                {determineTypeOfCell(2,2,2)}
                                {determineTypeOfCell(2,2,3)}
                                {determineTypeOfCell(2,2,4)}
                                {determineTypeOfCell(2,2,5)}
                                {determineTypeOfCell(2,2,6)}
                                {determineTypeOfCell(2,2,7)}
                                {determineTypeOfCell(2,2,8)}
                                {determineTypeOfCell(2,2,9)}
                                {determineTypeOfCell(2,2,10)}
                                {determineTypeOfCell(2,2,11)}
                                {determineTypeOfCell(2,2,12)}
                                {determineTypeOfCell(2,2,13)}
                                {determineTypeOfCell(2,2,14)}
                                {determineTypeOfCell(2,2,15)}
                                {determineTypeOfCell(2,2,16)}
                                {determineTypeOfCell(2,2,17)}
                                {determineTypeOfCell(2,2,18)}
                                {determineTypeOfCell(2,2,19)}
                                {determineTypeOfCell(2,2,20)}
                                {determineTypeOfCell(2,2,21)}
                                {determineTypeOfCell(2,2,22)}
                                {determineTypeOfCell(2,2,23)}
                                {determineTypeOfCell(2,2,24)}
                    </div>
                    <div id='bufferRow_1' className="bufferRow">
                                <span className='label rowNumber'>1</span>
                                {determineTypeOfCell(2,1,1)}
                                {determineTypeOfCell(2,1,2)}
                                {determineTypeOfCell(2,1,3)}
                                {determineTypeOfCell(2,1,4)}
                                {determineTypeOfCell(2,1,5)}
                                {determineTypeOfCell(2,1,6)}
                                {determineTypeOfCell(2,1,7)}
                                {determineTypeOfCell(2,1,8)}
                                {determineTypeOfCell(2,1,9)}
                                {determineTypeOfCell(2,1,10)}
                                {determineTypeOfCell(2,1,11)}
                                {determineTypeOfCell(2,1,12)}
                                {determineTypeOfCell(2,1,13)}
                                {determineTypeOfCell(2,1,14)}
                                {determineTypeOfCell(2,1,15)}
                                {determineTypeOfCell(2,1,16)}
                                {determineTypeOfCell(2,1,17)}
                                {determineTypeOfCell(2,1,18)}
                                {determineTypeOfCell(2,1,19)}
                                {determineTypeOfCell(2,1,20)}
                                {determineTypeOfCell(2,1,21)}
                                {determineTypeOfCell(2,1,22)}
                                {determineTypeOfCell(2,1,23)}
                                {determineTypeOfCell(2,1,24)}
                    </div>
                    <div id="displayColNumbers">
                            <div className='label displayColumnNumbers'>1</div>
                            <div className='label displayColumnNumbers'>2</div>
                            <div className='label displayColumnNumbers'>3</div>
                            <div className='label displayColumnNumbers'>4</div>
                            <div className='label displayColumnNumbers'>5</div>
                            <div className='label displayColumnNumbers'>6</div>
                            <div className='label displayColumnNumbers'>7</div>
                            <div className='label displayColumnNumbers'>8</div>
                            <div className='label displayColumnNumbers'>9</div>
                            <div className='label displayColumnNumbers'>10</div>
                            <div className='label displayColumnNumbers'>11</div>
                            <div className='label displayColumnNumbers'>12</div>
                            <div className='label displayColumnNumbers'>13</div>
                            <div className='label displayColumnNumbers'>14</div>
                            <div className='label displayColumnNumbers'>15</div>
                            <div className='label displayColumnNumbers'>16</div>
                            <div className='label displayColumnNumbers'>17</div>
                            <div className='label displayColumnNumbers'>18</div>
                            <div className='label displayColumnNumbers'>19</div>
                            <div className='label displayColumnNumbers'>20</div>
                            <div className='label displayColumnNumbers'>21</div>
                            <div className='label displayColumnNumbers'>22</div>
                            <div className='label displayColumnNumbers'>23</div>
                            <div className='label displayColumnNumbers'>24</div>
                        </div>
                </div>
                <div className='truck'>
                    {determineTypeOfCell(3, 1,1)}
                    <div className='label displayColumnNumbers'>Truck</div>

                </div>
                <div className="ship">
                        <div id='shipRow_9' className="shipRow">
                            <span className='label rowNumber'>9</span>
                            {determineTypeOfCell(1,9,1)}
                            {determineTypeOfCell(1,9,2)}
                            {determineTypeOfCell(1,9,3)}
                            {determineTypeOfCell(1,9,4)}
                            {determineTypeOfCell(1,9,5)}
                            {determineTypeOfCell(1,9,6)}
                            {determineTypeOfCell(1,9,7)}
                            {determineTypeOfCell(1,9,8)}
                            {determineTypeOfCell(1,9,9)}
                            {determineTypeOfCell(1,9,10)}
                            {determineTypeOfCell(1,9,11)}
                            {determineTypeOfCell(1,9,12)}
                        </div>
                        <div id='shipRow_8' className="shipRow">
                            <span className='label rowNumber'>8</span>
                            {determineTypeOfCell(1, 8,1)}
                            {determineTypeOfCell(1, 8,2)}
                            {determineTypeOfCell(1, 8,3)}
                            {determineTypeOfCell(1, 8,4)}
                            {determineTypeOfCell(1, 8,5)}
                            {determineTypeOfCell(1, 8,6)}
                            {determineTypeOfCell(1, 8,7)}
                            {determineTypeOfCell(1, 8,8)}
                            {determineTypeOfCell(1, 8,9)}
                            {determineTypeOfCell(1, 8,10)}
                            {determineTypeOfCell(1, 8,11)}
                            {determineTypeOfCell(1, 8,12)}
                        </div>
                        <div id='shipRow_7' className="shipRow">
                            <span className='label rowNumber'>7</span>
                            {determineTypeOfCell(1, 7,1)}
                            {determineTypeOfCell(1, 7,2)}
                            {determineTypeOfCell(1, 7,3)}
                            {determineTypeOfCell(1, 7,4)}
                            {determineTypeOfCell(1, 7,5)}
                            {determineTypeOfCell(1, 7,6)}
                            {determineTypeOfCell(1, 7,7)}
                            {determineTypeOfCell(1, 7,8)}
                            {determineTypeOfCell(1, 7,9)}
                            {determineTypeOfCell(1, 7,10)}
                            {determineTypeOfCell(1, 7,11)}
                            {determineTypeOfCell(1, 7,12)}
                        </div>
                        <div id='shipRow_6' className="shipRow">
                            <span className='label rowNumber'>6</span>
                            {determineTypeOfCell(1, 6,1)}
                            {determineTypeOfCell(1, 6,2)}
                            {determineTypeOfCell(1, 6,3)}
                            {determineTypeOfCell(1, 6,4)}
                            {determineTypeOfCell(1, 6,5)}
                            {determineTypeOfCell(1, 6,6)}
                            {determineTypeOfCell(1, 6,7)}
                            {determineTypeOfCell(1, 6,8)}
                            {determineTypeOfCell(1, 6,9)}
                            {determineTypeOfCell(1, 6,10)}
                            {determineTypeOfCell(1, 6,11)}
                            {determineTypeOfCell(1, 6,12)}

                        </div>
                        <div id='shipRow_5' className="shipRow">
                            <span className='label rowNumber'>5</span>
                            {determineTypeOfCell(1, 5,1)}
                            {determineTypeOfCell(1, 5,2)}
                            {determineTypeOfCell(1, 5,3)}
                            {determineTypeOfCell(1, 5,4)}
                            {determineTypeOfCell(1, 5,5)}
                            {determineTypeOfCell(1, 5,6)}
                            {determineTypeOfCell(1, 5,7)}
                            {determineTypeOfCell(1, 5,8)}
                            {determineTypeOfCell(1, 5,9)}
                            {determineTypeOfCell(1, 5,10)}
                            {determineTypeOfCell(1, 5,11)}
                            {determineTypeOfCell(1, 5,12)}
                        </div>
                        <div id='shipRow_4' className="shipRow">
                            <span className='label rowNumber'>4</span>
                            {determineTypeOfCell(1, 4,1)}
                            {determineTypeOfCell(1, 4,2)}
                            {determineTypeOfCell(1, 4,3)}
                            {determineTypeOfCell(1, 4,4)}
                            {determineTypeOfCell(1, 4,5)}
                            {determineTypeOfCell(1, 4,6)}
                            {determineTypeOfCell(1, 4,7)}
                            {determineTypeOfCell(1, 4,8)}
                            {determineTypeOfCell(1, 4,9)}
                            {determineTypeOfCell(1, 4,10)}
                            {determineTypeOfCell(1, 4,11)}
                            {determineTypeOfCell(1, 4,12)}
                        </div>
                        <div id='shipRow_3' className="shipRow">
                            <span className='label rowNumber'>3</span>
                            {determineTypeOfCell(1, 3,1)}
                            {determineTypeOfCell(1, 3,2)}
                            {determineTypeOfCell(1, 3,3)}
                            {determineTypeOfCell(1, 3,4)}
                            {determineTypeOfCell(1, 3,5)}
                            {determineTypeOfCell(1, 3,6)}
                            {determineTypeOfCell(1, 3,7)}
                            {determineTypeOfCell(1, 3,8)}
                            {determineTypeOfCell(1, 3,9)}
                            {determineTypeOfCell(1, 3,10)}
                            {determineTypeOfCell(1, 3,11)}
                            {determineTypeOfCell(1, 3,12)}
                        </div>
                        <div id='shipRow_2' className="shipRow">
                            <span className='label rowNumber'>2</span>
                            {determineTypeOfCell(1, 2,1)}
                            {determineTypeOfCell(1, 2,2)}
                            {determineTypeOfCell(1, 2,3)}
                            {determineTypeOfCell(1, 2,4)}
                            {determineTypeOfCell(1, 2,5)}
                            {determineTypeOfCell(1, 2,6)}
                            {determineTypeOfCell(1, 2,7)}
                            {determineTypeOfCell(1, 2,8)}
                            {determineTypeOfCell(1, 2,9)}
                            {determineTypeOfCell(1, 2,10)}
                            {determineTypeOfCell(1, 2,11)}
                            {determineTypeOfCell(1, 2,12)}
                        </div>
                        <div id='shipRow_1' className="shipRow">
                            <span className='rowNumber label'>1</span>
                            {determineTypeOfCell(1, 1,1)}
                            {determineTypeOfCell(1, 1,2)}
                            {determineTypeOfCell(1, 1,3)}
                            {determineTypeOfCell(1, 1,4)}
                            {determineTypeOfCell(1, 1,5)}
                            {determineTypeOfCell(1, 1,6)}
                            {determineTypeOfCell(1, 1,7)}
                            {determineTypeOfCell(1, 1,8)}
                            {determineTypeOfCell(1, 1,9)}
                            {determineTypeOfCell(1, 1,10)}
                            {determineTypeOfCell(1, 1,11)}
                            {determineTypeOfCell(1, 1,12)}
                        </div>

                        <div id="colNumbers">
                            <div className='label displayColumnNumbers'>1</div>
                            <div className='label displayColumnNumbers'>2</div>
                            <div className='label displayColumnNumbers'>3</div>
                            <div className='label displayColumnNumbers'>4</div>
                            <div className='label displayColumnNumbers'>5</div>
                            <div className='label displayColumnNumbers'>6</div>
                            <div className='label displayColumnNumbers'>7</div>
                            <div className='label displayColumnNumbers'>8</div>
                            <div className='label displayColumnNumbers'>9</div>
                            <div className='label displayColumnNumbers'>10</div>
                            <div className='label displayColumnNumbers'>11</div>
                            <div className='label displayColumnNumbers'>12</div>
                        </div>
                </div>
                
            </div>
        </div>
        )

       }


 
function DisplaySteps(props) 
{
    const [steps, setSteps] = useState(props.steps);
    const [showButton, setShowButton] = useState(false);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if(index === steps.length-1)
        {
           setShowButton(false);
        }
        else
        {
            
            setShowButton(true);
        }
      }, );
        
    return (
        <div id="displayStepsContainer">
                
                    {steps.map((step, stepIndex) => {
                return <Step key={stepIndex} {...step} stepIndex={stepIndex} index={index} length={steps.length} fileName={props.fileName} />
            })}
            {showButton && <button id="nextStepButton" className="next" onClick={() => setIndex(index + 1)}>Next Step</button>}
            
        </div>
    )
  
}
 
export default DisplaySteps;