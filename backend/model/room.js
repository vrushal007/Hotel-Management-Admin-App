const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    roomType:{
        type:String,
        require:true,
        unique:true
    },
    availableRooms:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required: true
    }
})

module.exports = mongoose.model('rooms',roomSchema)