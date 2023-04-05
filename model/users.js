const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const { schema } = require('./rooms');

const mongooseSchema = mongoose.Schema({
   name:{
    type:String,
    required:true,
   },
   email:{    
    type:String,
    required:true,
    unique:true,
   },
   password:{
    type:String,
    min:6,
    required:true
   },
   contact:{
    type:String,
    min:10,
    max:10,
    required:true
   },
   address:{
    type:String,
    required:true
   },
   isAdmin:{
    type:Boolean,
    required:true,
    default:false
   }

})

mongooseSchema.methods.getAuthToken = function(){
    return jwt.sign({_id:this._id,name:this.name,isAdmin:this.isAdmin},process.env.PRIVATE_KEY)
}

const USER = mongoose.model("user",mongooseSchema);

const vaildateUser = (user)=>{
  const schema = joi.object({
    name:joi.string().required(),
    email:joi.string().email().required(),
    password:joi.string().min(6).required(),
    contact:joi.string().min(10).max(10).required(),
    address:joi.string().required()
})
return schema.validate(user)
}


module.exports = {USER,vaildateUser}