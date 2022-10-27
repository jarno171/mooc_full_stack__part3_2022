const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv')

// read .env file
dotenv.config();
const Person = require('./models/person');

const app = express()

app.use(express.json())

const morganCustom = morgan(function (tokens, req, res) {
  let bodyToShow = ""

  if (tokens.method(req, res) === "POST") {
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

app.use(morganCustom)
app.use(cors())
app.use(express.static('build'))

app.get('/info', (req, res) => {
    let phoneBookSize = persons.length
    let currentTime = new Date()

    let stringToReturn = `<p>Phonebook has info for ${phoneBookSize} people</p>`
    stringToReturn += `<p>${currentTime}</p>`

    res.send(stringToReturn)
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(404).json({ error: 'name missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

// update existing
app.post('/api/persons/:id', (request, response) => {
  // just update phone number

  Person.findByIdAndUpdate(request.params.id, {number: request.body.number}, {new: true})
    .then(person => {
      response.json(person)
    })
})

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .deleteOne(() => {
      response.status(204).end()
    })
})


app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})