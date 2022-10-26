const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv');

// read .env file
dotenv.config();

const app = express()

const apiKey = process.env.MONGODB_API_KEY

const url = `mongodb+srv://fullstack:${apiKey}@cluster0.ex0257f.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

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

  const alreadyExists = persons.some(person => person.name === body.name)

  if (!body.name || !body.number || alreadyExists) {
    return response.status(400).json({ 
      error: 'name or number missing, or name already exists in phonebook' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number  
  }

  persons = persons.concat(person)

  response.json(person)
})

// update existing
app.post('/api/persons/:id', (request, response) => {
  // just update phone number
  persons = persons.map(person => {
    return person.id === Number(request.params.id) ? {...person, number: request.body.number}: person
  })

  response.json(persons.find(person => person.id === Number(request.params.id)))
})

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
    })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})