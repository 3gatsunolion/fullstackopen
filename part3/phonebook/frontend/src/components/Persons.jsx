const Persons = ({ persons, onDelete }) => {
  return (
    <>
      {persons.map(person => (
        <div key={person.name}>
          {person.name} {person.number} <button onClick={() => onDelete(person.id)}>delete</button>
        </div>
      ))}
    </>
  )
}

export default Persons