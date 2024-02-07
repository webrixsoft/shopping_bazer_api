require('dotenv').config()
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;


process.on('uncaughtException', err => {
        console.log('UNCAUGHT EXCEPTION! Shutting down...');
        console.log(err.name, err.message);
        process.exit(1);
});
const app = require('./app');
mongoose.connect(process.env.DATABASE, {
        // useNewUrlParser: true,
        // useCreateIndex: true
        // useFindAndModify: false
}).then(() => console.log('DB connection successfully...'));

const server = app.listen(port, () => {
        console.log(`Server running on port ${port}...`);
});