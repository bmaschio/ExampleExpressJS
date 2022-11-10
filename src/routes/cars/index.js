const express = require('express')
const { response } = require('express');
const { query, body, validationResult } = require('express-validator');
const Car = require('../../models/cars')


const routerCars = express.Router();

routerCars.post('/cars', body("modelBrand").exists(),
    body("modelName").exists(),
    body("engine").exists().isIn(['petrol', 'diesel', 'hybrid']),
    body("colour").exists(),
    async (req, res) => {

        try {
            const error = validationResult(req);

            if (!error.isEmpty()) {
                return res.status(400).json({ errors: error.array() });
            }

            const car = new Car(req.body)
            await car.save();
            res.status(201).json(car)
        } catch (error) {
            res.status(500).json({
                errors: [{
                    msg: error.message
                }]
            })
        }

    })

routerCars.put('/cars/:id', body("modelBrand").exists(),
    body("modelName").exists(),
    body("engine").exists().isIn(['petrol', 'diesel', 'hybrid']),
    body("colour").exists(),
    async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return res.status(400).json({ errors: error.array() });
            }

            const car = await Car.findById(req.params.id)
            if (!car) {

                return res.status(404).json({
                    errors: [{
                        msg: 'error missing car'

                    }]
                });
            }

            for (property in req.body) {
                car[property] = req.body[property];
            }
            await car.save();
            res.status(201).json(car)
        } catch (error) {
            res.status(500).json({
                errors: [{
                    msg: error.message
                }]
            })
        }

    })


routerCars.get('/cars/:id', async (req, res) => {
    try {

        const car = await Car.findById(req.params.id)
        if (!car) {

            return res.status(404).json({
                errors: [{
                    msg: 'error missing car'

                }]
            });
        }
        res.status(200).json(car)
    } catch (error) {
        res.status(500).json({
            errors: [{
                msg: error.message
            }]
        })
    }

})

routerCars.get('/cars', query("resultsInPage").exists().isInt(),
    query("numberOfPage").exists().isInt(),
    async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return res.status(400).json({ errors: error.array() });
            }
            
            const limit = req.query.resultsInPage
            const skipValue = req.query.numberOfPage * req.query.numberOfPage

            const cars = await Car.find({})
                                  .sort({_id : 'asc'})
                                  .limit(limit)
                                  .skip(skipValue)


            res.status(200).json({cars: cars})    
        } catch (error) {
            res.status(500).json({
                errors: [{
                    msg: error.message
                }]
            })
        }

    })


routerCars.delete('/cars/:id', async (req, res ) => {
    try {
       
       const car =  await Car.findByIdAndDelete(req.params.id)
       res.status(201).json(car)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            errors: [{
                msg: error.message
            }]
        })
    }
})


module.exports = routerCars;

