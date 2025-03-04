/**
 * Connects to a MongoDB database using the provided URL.
 */
const mongoose = require('mongoose')



/**
 * The URL of the MongoDB database.
 * @type {string}
 */
const url = process.env.MONGODB_URL


/**
* @param {string} url - The URL of the MongoDB database.
 * @returns {Promise} A Promise that resolves when the connection is successful.
 * @throws {Error} If there is an error connecting to the database.
*/
mongoose.connect(url)
    .then(()=> console.log("Connected"))
    .catch(err => console.log(err))