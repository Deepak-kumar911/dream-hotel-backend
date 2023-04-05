const { string, required } = require('joi');
const mongoose = require('mongoose');

const schema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
})

const Suscribe = mongoose.model("Suscriber",schema);
module.exports = Suscribe