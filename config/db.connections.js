const mongoose = require('mongoose');

require('dotenv').config();


const connectionStr = process.env.MONGODB_URI;

const connection = mongoose.connect(connectionStr);

mongoose.connection.on('connected', () => console.log(
    `${new Date().toLocaleTimeString()}: MongoDB connected...`
));

mongoose.connection.on('error', (error) => console.log(
    `${new Date().toLocaleTimeString()}: MongoDB error encountered...\n ${{ error }}`
));

mongoose.connection.on('disconnnected', () => console.log(
    `${new Date().toLocaleTimeString()}: MongoDB disconnected.`
));
mongoose.connect(process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }, err => {
        console.log('connected')
    });

module.exports = connection;