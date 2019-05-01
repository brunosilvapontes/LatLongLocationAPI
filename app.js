var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var locationRouter = require('./routes/location');

var app = express();
const mongoose = require('mongoose')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/location', locationRouter);

console.log('Connecting to the database...');
mongoose.connect('mongodb+srv://admin:tempbspTEMPBSP@cluster0-y86bj.mongodb.net/bsp?retryWrites=true', {useNewUrlParser: true})
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
