require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

// Whenever Express gets an HTTP GET request it will first check if the dist directory contains
// a file corresponding to the request's address. If a correct file is found, Express will return it.
// If there is an index.html file in dist directory, HTTP GET requests to the address www.serversaddress.com/index.html or
// www.serversaddress.com will serve it.
// GET requests to the address www.serversaddress.com/api/persons will be handled by the backend code.
app.use(express.static('dist'))

app.use(express.json())

morgan.token('post-body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})

app.use(
  morgan('tiny', {
    skip: (req) => req.method === 'POST'
  })
)

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :post-body', {
    skip: (req) => req.method !== 'POST'
  })
)

app.get('/api/persons', (request, response, next) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person
    .find({})
    .then((persons) => {
      const message = `
      <p>Phonebook has info for ${persons.length} ${persons.length === 1 ? 'person' : 'people'}</p>
      <p>${new Date()}</p>
      `
      response.send(message)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person
        .save()
        .then((updatedPerson) => {
          response.json(updatedPerson)
        })
    })
    .catch(error => next(error))
})

// const alreadyInPhonebook = (name) => !!persons.find(person => person.name === name)

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name && !body.number) {
    return response.status(400).json({
      error: 'Name and number are missing'
    })
  }

  if (!body.name) {
    return response.status(400).json({
      error: 'Name is missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'Number is missing'
    })
  }

  // if (alreadyInPhonebook(body.name)) {
  //   // 409 Conflict
  //   return response.status(409).json({
  //       error: 'name must be unique'
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// Must be after all other routes
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})