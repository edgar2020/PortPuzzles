import GridRow from './gridRow';

export default function Grid({ grid, toggle }) {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <h1 className="w-full border-b-8 pb-2">Select fgh to Unload</h1>
            <div className="cargoGridDisplayContainer">
                {/* <ul className="flex flex-col gap-2"> */}
                    {grid.map((row, i) => {
                        return (
                            <GridRow
                                key={i}
                                rowItems={row}
                                rowNum={i}
                                toggle={toggle}
                                />
                        );
                    })}
                {/* </ul> */}
            </div>
        </div>
    );
}
