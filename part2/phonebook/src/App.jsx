import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import personsService from './services/persons'

const Filter = ({ filter, onFilterChange }) => {
  return (
    <div>
      filter shown with <input onChange={onFilterChange} value={filter} />
    </div>
  )
}

const PersonForm = ({
  onSubmit,
  onNameChange,
  newName,
  onPhoneNumberChange,
  newPhoneNumber
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input onChange={onNameChange} value={newName} />
      </div>
      <div>
        number: <input onChange={onPhoneNumberChange} value={newPhoneNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

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

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState('')
  const [notificationClassName, setNotificationClassName] = useState('')

  const timer = useRef(null);

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)      
      })

    // clear on component unmount
    return () => {
      clearInterval(timer.current);
    }
  }, [])

  const clearNotification = () => {
    setNotification('')
    setNotificationClassName('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const person = persons.find(person => person.name === newName)
    if (person) {
      const message = `${newName} is already added to phonebook, replace the old number with a new one?`
      if (window.confirm(message)) {
        const newPerson = { ...person, number: newPhoneNumber }
        personsService
          .update(person.id, newPerson)
          .then(returnedPerson => {
            clearInterval(timer.current)
            setPersons(persons.map(p => p.id === person.id ? returnedPerson : p))
            setNewName("")
            setNewPhoneNumber("")
            setNotification(`Updated ${returnedPerson.name}'s number to ${returnedPerson.number}`)
            setNotificationClassName('success notification')
            timer.current = setTimeout(() => {
              clearNotification()
            }, 5000)
          })
          .catch(err => {
            clearInterval(timer.current)
            setPersons(persons.filter(p => p.id !== person.id))
            setNotification(`Information of ${person.name} has already been removed from server`)
            setNotificationClassName('error notification')
            timer.current = setTimeout(() => {
              clearNotification()
            }, 5000)
          })
      }
      return
    }

    personsService
      .create({ name: newName, number: newPhoneNumber })
      .then(returnedPerson => {
        clearInterval(timer.current)
        setPersons(persons.concat(returnedPerson))
        setNewName("")
        setNewPhoneNumber("")
        setNotification(`Added ${returnedPerson.name}`)
        setNotificationClassName('success notification')
        timer.current = setTimeout(() => {
          clearNotification()
        }, 5000)
      })
  }

  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }

  const handlePhoneNumberChange = (e) => {
    setNewPhoneNumber(e.target.value)
  }

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
  }

  const handleDelete = (id) => {
    const person = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${person.name} ?`)) {
      personsService
        .remove(id)

      setPersons(persons.filter(p => p.id !== id))
      clearInterval(timer.current)
      clearNotification()
    }
  }

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      {notification !== '' && <Notification className={notificationClassName} message={notification} />}
      <Filter filter={filter} onFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm
        onSubmit={handleSubmit}
        onNameChange={handleNameChange}
        newName={newName}
        onPhoneNumberChange={handlePhoneNumberChange}
        newPhoneNumber={newPhoneNumber}
      />
      <h2>Numbers</h2>
      <Persons
        persons={filteredPersons}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default App