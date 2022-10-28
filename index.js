const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv')

// read .env file
dotenv.config()
const Person = require('./models/person')

const app = express()

const morganCustom = morgan(function (tokens, req, res) {
  let bodyToShow = ''

  if (tokens.method(req, res) === 'POST') {
    bodyToShow = JSON.stringify(req.body)
  }

  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    bodyToShow
  ].join(' ')
})

// load middleware
app.use(express.static('build'))
app.use(express.json())
app.use(morganCustom)
app.use(cors())

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

// update existing
app.post('/api/persons/:id', (request, response) => {
  // just update phone number

  Person.findByIdAndUpdate(request.params.id, { number: request.body.number }, { new: true })
    .then(person => {
      response.json(person)
    })
})

// update existing
app.put('/api/persons/:id', (request, response, next) => {
  // just update phone number

  Person.findByIdAndUpdate(request.params.id, { number: request.body.number }, { new: true, runValidators: true, context: 'query' })
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
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


// middleware in case of problems
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})