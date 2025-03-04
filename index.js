const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const port = 5555;
const router = require("express").Router()
const userRoute = require("./routers/user")
const authRoute = require("./routers/auth")
const addressRoute = require("./routers/address")
const adminRoute = require("./routers/admin")
const documentRoute = require("./routers/document")
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');


dotenv.config();

/**
 * Middleware that parses incoming requests with JSON payloads.
 */

app.use(express.json());

/**
 * Connect to the MongoDB database using Mongoose.
 */

require('./db/mongoose');

/**
 * Middleware that handles user-related routes.
 * 
 */

app.use("/api/user", userRoute);

/**
 * Middleware that handles authentication-related routes.
 */

app.use("/api/auth", authRoute);

/**
 * Middleware that handles address-related routes.
 */

app.use("/api/address", addressRoute);

/**
 * Middleware that handles admin-related routes.
 */

app.use("/api/admin", adminRoute);

/**
 * Middleware that handles document-related routes.
 */

app.use("/api/document", documentRoute);

/**
 * Swagger Documentation Setup
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * Start the Express server.
 */

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
