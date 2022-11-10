const {mongoose , Schema } = require("mongoose")

const carSchema = new Schema({
    modelBrand: {
        type: String,
        required: true
    },
    modelName: {
        type: String,
        required : true,
    },
     engine: {
        type: String,
        enum : ['petrol','diesel', 'hybrid'],
        default: 'petrol'
    },  
     colour :{
        type: String ,
        required: true
    }
})

carSchema.methods.toJSON = function () {
    return {
      id: this._id,
      modelBrand: this.modelBrand,
      modelName: this.modelName,
      engine: this.engine,
      colour: this.colour
    }
  }


const Car =  mongoose.model('cars',carSchema )



module.exports = Car;