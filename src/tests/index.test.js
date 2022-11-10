const app = require('../app')
const supertest = require("supertest");
const mongoose = require('mongoose');
const shell = require('shelljs');





const client = supertest(app)
jest.setTimeout(30000)

describe("Test impementation", () => {
    let idCar = null

    beforeAll(async () => {
        shell.exec('docker pull bitnami/mongodb:latest')
        shell.exec('docker container prune -f')
        shell.exec('docker run -p 27017:27017 --name mongodb-test  -d bitnami/mongodb:latest')
        shell.exec('sleep 5')

        console.log('I am getting ready to mongodb')

        const mongodb_url = "mongodb://localhost:27017"

        await mongoose.connect(mongodb_url)
        await mongoose.connection.dropDatabase()


    })


    afterAll(async () => {

        await mongoose.connection.dropDatabase()
        await mongoose.disconnect()
        shell.exec('docker stop mongodb-test')


    })


    it('car creation with wrong body type', async () => {
        const data = {
            engine : "nuclear-engine"
            
        }

       
        const response = await client.post('/api/v1/cars').send(data)

        console.log(response.body)      
        expect(response.status).toBe(400)


    });


    it('car creation', async () => {
        const data = {
            modelBrand: "FIAT",
            modelName:"Cinquencento",
            engine : "petrol",
            colour: "green"
            
        }

        const response = await client.post('/api/v1/cars').send(data)

        console.log(response.body)      
        expect(response.status).toBe(201)
        idCar = response.body.id
        


    });


    it('car update with wrong body type', async () => {
        const data = {
            engine : "nuclear-engine"
            
        }

       
        const response = await client.put(`/api/v1/cars/${idCar}`).send(data)

        console.log(response.body)      
        expect(response.status).toBe(400)


    });

    it('car update wrong id', async () => {
        const data = {
            modelBrand: "FIAT",
            modelName:"Cinquencento",
            engine : "petrol",
            colour: "red"
            
        }

    
        const response = await client.put(`/api/v1/cars/636c2a9013296c5fc77abd3b`).send(data)

        console.log(response.body)      
        expect(response.status).toBe(404)

    });


    it('car update', async () => {
        const data = {
            modelBrand: "FIAT",
            modelName:"Cinquencento",
            engine : "petrol",
            colour: "red"
            
        }

    
        const response = await client.put(`/api/v1/cars/${idCar}`).send(data)

        console.log(response.body)      
        expect(response.status).toBe(201)

    });


    it('car get wrong id', async () => {

        const response = await client.get('/api/v1/cars/636c2a9013296c5fc77abd3b')
        console.log(response.body)      
        expect(response.status).toBe(404)

    });

    it('get car', async () => {

        const response = await client.get(`/api/v1/cars/${idCar}`)
        console.log(response.body)      
        expect(response.status).toBe(200)

    });


    it('get car', async () => {

        const response = await client.get(`/api/v1/cars/${idCar}`)
        console.log(response.body)      
        expect(response.status).toBe(200)

    });



    it('get cars wrong parameters', async () => {

        const response = await client.get('/api/v1/cars').query({resultsInPage: "uno" , numberOfPage:""})
        console.log(response.body)      
        expect(response.status).toBe(400)

    });


    it('get cars', async () => {

        let response = await client.get('/api/v1/cars').query({resultsInPage: 1 , numberOfPage: 0})
        console.log(response.body)      
        expect(response.status).toBe(200)
        expect(response.body.cars.length).toBe(1)
        response = await client.get('/api/v1/cars').query({resultsInPage: 1 , numberOfPage: 1})
        console.log(response.body)  
        expect(response.body.cars.length).toBe(0)


    });



    it('car delete wrong id', async () => {

        const response = await client.delete('/api/v1/cars/636c2a9013296c5fc77abd3b')
        console.log(response.body)      
        expect(response.status).toBe(201)

    });


    it('delete car', async () => {

        const response = await client.delete(`/api/v1/cars/${idCar}`)
        console.log(response.body)      
        expect(response.status).toBe(201)

    });



})

