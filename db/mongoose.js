/**
 * Connects to a MongoDB database using the provided URL.
 */
const mongoose = require('mongoose')


const url = process.env.MONGODB_URL

mongoose.connect(url)
    .then(()=> console.log("Connected"))
    .catch(err => console.log(err))