const router = require('express').Router()
const Room = require('../model/rooms');
const auth = require('../middleware/auth')
const admin = require('../middleware/admin');
const { USER } = require('../model/users');



router.post("/", async (req, res) => {
    try {
        const room = new Room(req.body);
        await room.save()
        res.status(201).send(room)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.get("/allrooms",async(req,res)=>{
    try {
        const room = await Room.find().select("-slots")
        res.status(200).json(room);
    } catch (err) {
        res.status(500).send(err)
    }
} )

router.get("/rooms",[auth,admin], async(req,res)=>{
    try {
        const room = await Room.find()
        res.status(200).json(room);
    } catch (err) {
        res.status(500).send(err)
    }
} )

router.get("/sortById/:id",async(req,res)=>{
    try {
        const room = await Room.findById(req.params.id).select("-slots")
        if(!room) return res.status(404).send("Not found")
        res.status(200).json(room);
    } catch (err) {
        res.status(500).send(err)
    }
} )

router.get("/sortByName/:name",async(req,res)=>{
    try {
        const room = await Room.find({name:req.params.name}).select("-slots")
        if(!room) return res.status(404).send("Not found")
        res.status(200).json(room);
    } catch (err) {
        res.status(500).send(err)
    }
} )

router.patch("/room/:_id",[auth,admin],async(req,res)=>{
    try {
        const room = await Room.findByIdAndUpdate({ _id: req.params._id },req.body,{new:true}).select({"name":1,"available":1});
        res.status(200).send(room)
    } catch (err) {
        res.status(500).send(err)
    }
})



router.patch("/book/:_id", auth,  async (req, res) => {
    try {
        const room = await Room.find({ _id: req.params._id });
        if(!room) return res.status(404).send("room not available")

        const user = await USER.findById(req.body.userId);
        if(!user) res.status(404).send("Not found User")
        // console.log(req.body.userId,req.user._id);
        if(req.body.userId!==req.user._id) return res.status(401).send("Invaild token");
        
        const totalDays = ((new Date(req.body.endDate).getTime() - new Date(req.body.startDate).getTime()) / (1000 * 3600 * 24))+1
        const notCancel = room[0].slots.filter(slot=>slot.booked===true)
        const bookedRoom = notCancel.filter(slot => (new Date(slot.startDate).toLocaleDateString() === new Date(req.body.startDate).toLocaleDateString() || 
        new Date(slot.endDate).getTime() >= new Date(req.body.endDate).getTime()));
        
        let total = 0;
        for(let elm of bookedRoom){
            total+=elm.no_of_rooms
        }        
        if ((total+ Number(req.body.no_of_rooms)) <= room[0].available ) {
            // console.log(room);
            const book = await Room.findByIdAndUpdate(req.params._id,
                {
                    $push: {
                        slots: {
                            userId: req.body.userId,
                            userName:user.name,
                            userAddress:user.address,
                            userContact:user.contact,
                            startDate: req.body.startDate,
                            endDate: req.body.endDate,
                            no_of_rooms:req.body.no_of_rooms,
                            bookAt:new Date(),
                            days: totalDays,
                            amount: totalDays * req.body.no_of_rooms * room[0].dailyRentalRate
                        }
                    }
                },
                { new: true }).select("-slots");
            await book.save();
            res.status(200).send(book)
        }else{
            if(total+req.body.no_of_rooms > room[0].available){
                const leftRooms =room[0].available-total
                    res.status(400).send(`only ${leftRooms} rooms available on this date`)
            }else {
                let endDate = []
                for (let elm of bookedRoom) {
                    endDate.push(new Date(elm.endDate).getTime())
                }
                
                console.log(endDate);
                let closedate = new Date(Math.min(...endDate)).toLocaleDateString()
                res.status(200).send(`Room not available, consider ${closedate} and above date`)
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err)
    }

})

module.exports = router;


