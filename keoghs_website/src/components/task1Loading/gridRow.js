
import GridButton from './gridToggleButton';
import GridCell from './gridCell';

export default function gridRow({ rowItems, rowNum, toggle }) {
    if(toggle === 1 )
    {
        if(rowNum !== 8)
        {
            return (
                <div className="gridRows">
                    {/* <span className='rowNumbering'>{rowNum+1}</span> */}
                    {rowItems.map((slot, i) => (
                        <GridButton key={'row('+i+')'} slot={slot} row={rowNum} col={i} />
                        ))}
                </div>
            );
        }
    }
    else
    {
        return (
            <div className="gridRows">
                {rowItems.map((slot, i) => (
                    <GridCell key={'row('+i+')'} slot={slot} row={rowNum} col={i} />
                ))}
            </div>
        );
    }
}