const express=require('express');
const User=require('../models/User');
const router=express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const fetchUser=require('../middleware/fetchUser');

const JWT_SECRECT="Kgakinghassignedthis$";
//ROUTE 1: Create a user using: POST "/api/auth/createuser". No login required
router.post('/createuser',[
    body('name','Enter a valid name').isLength({min:3}),
    body('email','Enter a valid email').isEmail(),
    body('password','Password length is too short').isLength({min:5}),
],async(req,res)=>{
    let success=false;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success,errors:errors.array()});
        }
        try {
            let user= await User.findOne({email:req.body.email});
            if(user){
                return res.status(400).json({success,error:"User already exists with that email"});
            }
            const salt=await bcrypt.genSalt(10);
            const SecPass=await bcrypt.hash(req.body.password, salt);
             user=await User.create({
                name: req.body.name,
                password: SecPass,
                email: req.body.email,
            })
            const data={
                user:{
                    id: user.id
                }
            }
            const authToken=jwt.sign(data,JWT_SECRECT);
            success=true;
            res.json({success,authToken});
        } catch (error) {
            console.log(error.message);
            res.send(500).send("Internal Server Error");
        }
})

//ROUTE 2: Authenticate a user using: POST "/api/auth/login". No login required
router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists(),
],async(req,res)=>{
    let success=false;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {email,password}=req.body;
    try {
        let user= await User.findOne({email});
        if(!user){
            success=false;
            return res.status(400).json({success,error:"Please login with correct credentials"});
        }
        const passwordCompare=await bcrypt.compare(password,user.password);
    if(!passwordCompare){
        success=false;
        return res.status(400).json({success,error:"Please login with correct credentials"});
    }
    const payload={
        user:{
            id:user.id
        }
    }
const authToken=jwt.sign(payload,JWT_SECRECT);
success=true;
res.json({success,authToken});
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}
})


//ROUTE 3: Get loggedin user details using: POST "/api/auth/getuser".login required
router.post('/getuser',fetchUser,async(req,res)=>{


try {
    const userId=req.user.id;
    const user=await User.findById(userId).select("-password");
    res.send(user);
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}
})

module.exports=router;