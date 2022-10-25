const express = require('express')
var morgan = require('morgan')

const app = express()

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

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

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    let phoneBookSize = persons.length
    let currentTime = new Date()

    let stringToReturn = `<p>Phonebook has info for ${phoneBookSize} people</p>`
    stringToReturn += `<p>${currentTime}</p>`

    res.send(stringToReturn)
})

const generateId = () => {
  /* This seems nonsensical??? */
  return Math.floor(Math.random() * 1000000000)
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

app.get('/api/persons', (req, res) => {
  res.json(persons)
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})