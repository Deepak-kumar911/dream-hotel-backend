const router = require('express').Router()
const Suscribe = require('../model/suscribe');

router.post("/",async(req,res)=>{
    try {
        let suscribe = await Suscribe.find({email:req.body.email});
        if(suscribe.length!==0) return res.status(400).send("Already Suscribe");
         suscribe = await new Suscribe(req.body);
         suscribe.save()
         res.status(201).send("Thank you for suscribe")
     } catch (error) {
        res.status(500).send(error)
     }
})

router.get("/",async(req,res)=>{
    try {
        const suscribers = await Suscribe.find();
        res.status(200).send(suscribers)
     } catch (error) {
        res.status(500).send(error)
     }
})

module.exports = router