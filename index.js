const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config()
const cors = require('cors')
require('morgan')("common")
const booking = require('./router/rooms');
const user = require('./router/users')
const suscribe = require('./router/suscribe')



mongoose.connect(process.env.DATABASE_URL)
.then(()=>console.log("successfull connect"))
.catch((err)=>console.log("something failed",err))


//middleware
app.use(express.json())
app.use(cors())
app.use("/api/roombooking",booking);
app.use("/api/user",user);
app.use("/api/suscribe",suscribe);




app.listen(process.env.PORT,()=>{
    console.log(`listening to ${process.env.PORT}`);
})