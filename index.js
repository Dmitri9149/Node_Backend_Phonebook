require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())

app.use(bodyParser.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

app.use(cors())

app.use(express.static('build'))

const getRandomInt = () => 
  Math.floor(Math.random() * Math.floor(maxId))
const maxId = 1000000000

app.get('/', (request, response) =>  {
    response.send('<h1>Hello from Server</h1>')
}
)

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)})
})

app.get('/info', (request, response) => {
  response.send(`
    <div>
      <p>
      ${new Date().toString()}
      </p>
      <p>
        Phonebook has info for ${persons.length} persons.
      </p>
    </div>`
  )
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if(note) {
      response.json(person.toJSON())
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request,response) => {
  const body = request.body
// no content -> error
  if(body === undefined) {
    return response.status(400).json({
      error:'content missed'
    })
  }

  const person = new Person({
    name:body.name,
    number:body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson.toJSON())
  })

})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})