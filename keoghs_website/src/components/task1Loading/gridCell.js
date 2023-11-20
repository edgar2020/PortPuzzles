
import '../tasks.css';

function generateContainers(slotData, row, col)
{
    // console.log(slotData);
    if(slotData.container === null && slotData.deadSpace === 1)
    {
        
        console.log(0);
        return (
            <div
                key={'row('+row+')col('+col+')'}
                className= //Just to have striped rows
                    'gridCell no-interact unusable'>
            </div>
        );
    }
    else if(slotData.container === null && slotData.deadSpace === 0)
    {
        console.log(1);
        return (
            <div
                key={'row('+row+')col('+col+')'}
                className= //Just to have striped rows
                    'gridCell no-interact empty'>

            </div>
        );
    }
    else if(slotData.container !== null)
    {
        return (
            <div
                key={'row('+row+')col('+col+')'}
                className= //Just to have striped rows
                    'gridCell no-interact containerPresent'>

                        {/* {slotData.container.name.substring(0,4)} */}

            </div>
        );
    }
}

export default function GridButton({ slot, row, col }) {
    return (
        <div>
            {generateContainers(slot, row, col)}

        </div>

    );
}