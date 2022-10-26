const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.ex0257f.mongodb.net/?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const addPerson = ({name, number}) => {
  mongoose
    .connect(url)
    .then((result) => {

      const person = new Person({
        name: name,
        number: number
      })

      return person.save()
    })
    .then(() => {
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}

const findAll = () => {
  mongoose.connect(url)

  Person.find({})
    .then(result => {
      console.log("phonebook:")
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
}

//addPerson({name: "Nasu", number: "123"})
// no check for correct amount of args..
if (process.argv.length > 3) {
  addPerson({name: process.argv[3], number: process.argv[4]})
  console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
} else {
  findAll()
}
