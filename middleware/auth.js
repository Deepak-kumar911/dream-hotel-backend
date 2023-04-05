const jwt = require('jsonwebtoken')

function auth(req,res,next){
 const token = req.header("x-auth-token");
 if(!token) return res.status(401).send("Unauthorized!")

 try {
    const decode = jwt.verify(token,process.env.PRIVATE_KEY);
    req.user = decode;
    req._id = decode._id;
    next()
}catch (err) {
    res.status(401).send("Unauthorized! invailed token");
}
}

module.exports =auth