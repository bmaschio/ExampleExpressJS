const mongoose = require('mongoose')
const app = require('./app')


if (process.env.NODE_ENV !== 'PRODUCTION'){
    require('dotenv').config();
}



if (!process.env.MONGO_URL) {
    throw new Error("No mongo url provided")
}


 const mongoConnection =  mongoose.connect(process.env.MONGO_URL) 


mongoose.createConnection(process.env.MONGO_URL).asPromise();
mongoConnection.then(() => {
    app.listen ( 8080 ,()=>{
        console.log ( `Connected with mongoDB at ${process.env.MONGO_URL}`) 
        console.log ( 'Example Started on http://localhost:8080') 
    }) 
})