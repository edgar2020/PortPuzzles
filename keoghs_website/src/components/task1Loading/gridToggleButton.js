
import '../tasks.css';

function generateContainers(slotData, row, col)
{
    // console.log(slotData);
    if(slotData.container === null && slotData.deadSpace === 1)
    {
        // console.log(0);
        return (
            <>
                {/* <div className="extraDetails">I am shown when someone hovers over the div above.</div> */}
                <button
                    key={'row('+row+')col('+col+')'}
                    className= //Just to have striped rows
                    'gridCell gridToggleButton unusable'>
                </button>
            </>
        );
    }
    else if(slotData.container === null && slotData.deadSpace === 0)
    {
        console.log(1);
        return (
            <>
                <button
                    key={'row('+row+')col('+col+')'}
                    className= //Just to have striped rows
                    'gridCell gridToggleButton empty'>

                </button>
            </>
        );
    }
    else if(slotData.container !== null)
    {
        return (
            <button
            key={'row('+row+')col('+col+')'}
                className= //Just to have striped rows
                    'gridCell gridToggleButton containerPresent'>
                        {'['+(row+1)+', '+(col+1)+']'}
                        {/* {slotData.container.name.substring(0,4)} */}

            </button>
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