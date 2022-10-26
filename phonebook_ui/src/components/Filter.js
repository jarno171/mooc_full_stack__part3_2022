import React from 'react'

const Filter = (props) => {
    return (
        <>
            filter shown with <input
                onChange={props.filterChange}
            /> 
        </>
    )
}

export default Filter