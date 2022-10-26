import React from 'react'

const Person = (props) => {
    const contains = props.name.includes(props.searchCriteria)
  
    /* If name contains search criteria */
    if (contains) {
      return (
        <>
          {props.name} {props.number}
          < button onClick={() => props.removePersonFunction(props.id)} >
            delete
          </ button >
        </>
      )
    }
    else {
      return (
        <>
        </>
      )
    }
  }

const Persons = (props) => {
    return (
        <>
            {props.persons.map(person => (
                <p key={person.name}>
                  < Person name={person.name} number={person.number} id={person.id} searchCriteria={props.searchCriteria} removePersonFunction={props.removePersonFunction} />
                </p>
            ))}
        </>
    )
}

export default Persons