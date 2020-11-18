require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/persons')


app.use(express.static('build'))

// let persons = [
//     {
//         id: 1,
//         name: "Artos Hellas ",
//         number: "040-123456",
//     },
//     {
//         id: 2,
//         name: "Ada Lovelace",
//         number: "781-222-3334",
//     }, {
//         id: 3,
//         name: "Danny Abramov",
//         number: "219-415-2345",
//     },
//     {
//         id: 4,
//         name: "Mary Poppendieck",
//         number: "004-343-22344",
//     }

// ]
// const names = persons.map(person => person.name)
// const numbers = persons.map(num => num.number)

app.use(express.json())
app.use(cors())

const morganLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

let today = new Date();
let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();


app.use(morgan('tiny'))
app.use(morganLogger)

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})


app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        response.send(`Phonebook has ${persons.length} people ${date}`)
    })

})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(persons => {
        response.json(persons)
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body.content)
    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }

    const persons = new Person({
        name: body.name,
        number: body.number || 0
    })

    persons.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })



const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})




// app.get('/api/persons', (request, response) => {
//     response.json(persons)
// })


// app.get('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     const personEntry = persons.find(personEntry => personEntry.id === id)

//     if (personEntry) {
//         response.json(personEntry)
//     } else {
//         response.status(404).send()
//     }
// })

// const generateId = () => {
//     const maxId = persons.length > 0
//         ? Math.floor(Math.random() * (10000 - 4 + 1)) + 4
//         : 0
//     return maxId + 1
// }














