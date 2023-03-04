const mongoose = require('mongoose')

const myModel = new mongoose.Schema({
    login: String,
    password: String,
    name: String
})

module.exports = mongoose.model('myModel', myModel)