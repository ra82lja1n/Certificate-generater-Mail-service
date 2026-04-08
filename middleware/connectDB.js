
const mongoose = require('mongoose')
const {configDotenv} = require('dotenv')

configDotenv()

const dbURL = process.env.dbURL

const connectDB = async () =>{
    try {
        await mongoose.connect(dbURL)
        console.log("Database Connected")
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB