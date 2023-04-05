const router = require('express').Router();
const { USER, vaildateUser } = require('../model/users');
const Room = require('../model/rooms')
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth')


router.post("/register", async (req, res) => {
    try {
        let check = await USER.find({ email: req.body.email });
        console.log(check);
        if (check.length!==0) return res.status(400).send("user already register");

        const { error } = await vaildateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message)

        let user = await new USER(req.body);
        let salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        const token = await user.getAuthToken();
        await user.save()
        res.status(201).header("x-auth-token", token).header("access-control-expose-headers", "x-auth-token").send("register")

    } catch (err) {
        console.log(err);
        res.status(500).send(err)
    }
});


router.post("/login", async (req, res) => {
    try {
        const user = await USER.find({ email: req.body.email });
        if (user.length===0) return res.status(404).send("Invaild email and password");

        const validate = await bcrypt.compare(req.body.password, user[0].password);
        if (!validate) return res.status(404).send("invaild email & password");
        const token = await user[0].getAuthToken();
        console.log("user",token);
        res.status(201).header("x-auth-token", token).header("access-control-expose-headers", "x-auth-token").send("Login")
    } catch (err) {
        console.log(err);
        res.status(500).send(err)
    }
})

router.get("/allbooking/:_id",auth, async (req, res) => {
    try {
        const user = await USER.findById(req.params._id).select({ "password": -1 });
        if (!user) res.status(404).send("user not found");

        const rooms = await Room.find({ slots: { $elemMatch: { userId: req.params._id } } })

        const result = rooms.map(room => {
            let { _id, name, available, dailyRentalRate } = room
            let obj = { _id, name, available, dailyRentalRate }
            let Userslot = room.slots.filter(user => user.userId === req.params._id)
            let sortbySlot = Userslot.map(slot => { return { ...obj, slot } })
            return sortbySlot
        })

        let sortbyOne = []
        for (let elm of result) {
            sortbyOne.push(...elm)
        }
        res.status(200).send(sortbyOne)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.patch("/cancelRoom/:book_id", async(req,res)=>{
    try {
        const validate = await Room.find({slots:{$elemMatch:{_id:req.params.book_id}}});
        if(validate.length===0) return res.status(404).send("Not found any room")
        const book = await Room.findOneAndUpdate({"slots._id":req.params.book_id},{$set:{"slots.$.booked":false}},{new:true})
        res.status(200).send(book)
    } catch (err) {
        console.log(err);
        res.status(500).send(err)
    }

})

module.exports = router
