const routerCars = require("./routes/cars")
const express = require('express')

const app = express()

app.use(express.json());

app.use("/api/v1" ,routerCars  )


module.exports=app