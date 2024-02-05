const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const app = require('./app');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT;
const connectionParams = {
        // useNewUrlParser: true,
        // useCreateIndex: true,
        // useUnifiedTopology: true
}

mongoose.connect(process.env.DATABASE, connectionParams)
        .then(() => {
                console.log('DB connection successful!....')
        }).catch((err) => {
                console.error(`Error connecting to the database. n${err}`)
        })
        
        
        const server = app.listen(PORT, () => {
            console.log(`App running on port ${PORT} and ${process.env.DATABASE}...`);
        })