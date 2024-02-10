const User=require('../models/User')
const {hashPassword,comparePasswords}=require('../helper/auth')
const jwt=require('jsonwebtoken');

const test=(req,res)=>{
    res.json('test is working!')
}

//register end point 
const registerUser=async (req,res)=>{
    try{
        const {name,email,password}=req.body;
        if(!name){
            return res.json({
                error:"Name is required!!"
            })
        };
        if(!password || password.length <6){
            return res.json({
                error:'Password is required and should be atleast 6 characters long'
            })
        };
        //check email
        const exist=await User.findOne({email});
        if(exist){
            return res.json({
                error:'Email is already taken'
            })
        }

        const hashedPassword=await hashPassword(password)
        const user=await User.create({
            name,email,password:hashedPassword,
        })

        return res.json(user)
    }
    catch(error){
        console.log(error)
    }
}

//login end point 

    const loginUser=async (req,res)=>
    {
        try{
            const {email,password}=req.body;

            const user=await User.findOne({email});
            if(!user){
                return res.json({
                    error:'No User Found'
                })
            }
            
            const match=await comparePasswords(password,user.password)
            if(match){
                jwt.sign({email:user.email, id:user._id,name:user.name},process.env.JWT_SECRET,{},(err,token)=>{
                    if(err) throw err;
                    res.cookie('token',token).json(user)
                })
            }
            if(!match){
                res.json({
                    error:'Passwords donot match'
                })
            }

        }
        catch(err){
            console.log(err);
        }

    }


const getProfile=(req,res)=>{
    const {token}=req.cookies
    if(token){
        jwt.verify(token,process.env.JWT_SECRET,{},(err,user)=>{
            if(err) throw err;  
            res.json(user)
        })

    }
    else{
        res.json(null)
    }
}
module.exports={
    test,
    registerUser,
    loginUser,
    getProfile

}