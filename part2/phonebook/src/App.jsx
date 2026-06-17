import { useState, useEffect, useRef } from 'react'
import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personsService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({ message: null })

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

  const showNotification = (message, isError = false) => {
    clearInterval(timer.current)
    setNotification({ message, className: isError ? 'error notification' : 'success notification' })
    timer.current = setTimeout(() => {
      setNotification({ message: null })
    }, 5000)
  }

  const clearForm = () => {
    setNewName('')
    setNewPhoneNumber('')
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
            setPersons(persons.map(p => p.id === person.id ? returnedPerson : p))
            clearForm()
            showNotification(`Updated ${returnedPerson.name}'s number to ${returnedPerson.number}`)
          })
          .catch(err => {
            setPersons(persons.filter(p => p.id !== person.id))
            showNotification(`Information of ${person.name} has already been removed from server`, true)
          })
      }
      return
    }

    personsService
      .create({ name: newName, number: newPhoneNumber })
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        clearForm()
        showNotification(`Added ${returnedPerson.name}`)
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
    }
  }

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
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