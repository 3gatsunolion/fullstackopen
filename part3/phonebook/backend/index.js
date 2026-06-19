const express = require('express')
const morgan = require('morgan')
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

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const message = `
    <p>Phonebook has info for ${persons.length} ${persons.length === 1 ? "person" : "people"}</p>
    <p>${new Date()}</p>
    `
    response.send(message)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
  
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

const generateId = () => {
//   const maxId = persons.length > 0
//     ? Math.max(...persons.map(n => Number(n.id)))
//     : 0
//   return String(maxId + 1)
    return String(Math.floor(Math.random() * 1000000000)) // 0 to 999,999,999
}

const alreadyInPhonebook = (name) => !!persons.find(person => person.name === name)

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name is missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number is missing' 
    })
  }

  if (alreadyInPhonebook(body.name)) {
    // 409 Conflict
    return response.status(409).json({
        error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// Must be last
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})