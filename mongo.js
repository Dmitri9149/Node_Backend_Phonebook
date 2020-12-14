const mongoose = require('mongoose')

if (process.argv.length < 6) {
  console.log('Not enought arguments. exit!')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://full_stack:${password}@cluster0.2m41j.mongodb.net/full_stack?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number:String
})

const Person = mongoose.model('Person', noteSchema)

const person = new Person({
    name = process.argv[3],
    number = process.argv[4]

})

person.save().then(result => {
  console.log('person saved!')
  mongoose.connection.close()
})