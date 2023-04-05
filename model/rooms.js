const { string } = require('joi');
const mongoose = require('mongoose');

const mongooseSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    available:{
        type:Number,
        required:true,
        min:1
    },

    //id:string means date in times
    property_facility:[
        {name:{type:String,required:true},
        id:{type:String,required:true}}],

    services:[
        {name:{type:String,required:true},
        id:{type:String,required:true}}],
    general:[
        {name:{type:String,required:true},
        id:{type:String,required:true}}],
    saftey_security:[
        {name:{type:String,required:true},
        id:{type:String,required:true}}],

    dailyRentalRate:{type:Number,required:true},
    slots:[
        {userId:{type:String,required:true},
        userName:{type:String,required:true},
        userAddress:{type:String,required:true},
        userContact:{type:String,required:true},
        startDate:{type:Date,required:true},
        endDate:{type:Date,required:true},
        no_of_rooms:{type:Number,required:true},
        days:{type:Number,required:true},
        amount:{type:Number,required:true},
        booked:{type:Boolean,required:true,default:true},
        bookAt:{type:Date,required:true}
        
    }]
})

const Room = mongoose.model("Booking",mongooseSchema);

module.exports = Room