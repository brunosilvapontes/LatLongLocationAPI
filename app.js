const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const locationRouter = require('./routes/location');
const config = require('./config')

const app = express();
const mongoose = require('mongoose')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/location', locationRouter);

console.log('Connecting to the database...');
mongoose.connect(config.mongoDb.connectionString, {useNewUrlParser: true})
    .then(mongoConnection => {
        console.log('Connected :)');
        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    })
    .catch(err => {
        console.log(err);
        console.log('Error on database connection :(');
        process.exit(0)
    })

module.exports = app;
