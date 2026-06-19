require('dotenv').config()
const Person = require('./models/person')
const mongoose = require('mongoose')

let persons = [
  {
    'id': '1',
    'name': 'Arto Hellas',
    'number': '040-123456'
  },
  {
    'id': '2',
    'name': 'Ada Lovelace',
    'number': '040-22334455'
  },
  {
    'id': '3',
    'name': 'Dan Abramov',
    'number': '09-1234556'
  },
  {
    'id': '4',
    'name': 'Mary Poppendieck',
    'number': '393-6423122'
  }
]

const promises = persons.map(({ name, number }) => {
  const person = new Person({ name, number })

  return person.save()
})

Promise.all(promises)
  .then(() => {
    console.log('All persons saved!')
    mongoose.connection.close()
  })
  .catch(error => {
    console.error(error)
    mongoose.connection.close()
  })