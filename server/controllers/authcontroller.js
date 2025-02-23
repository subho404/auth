
  import bcrypt from 'bcryptjs';
   import jwt from 'jsonwebtoken';
import usermodel from '../models/usermodel.js';
export const registered=async(req,res)=>{
    const {name,email,password}=req.body;


    if(!name || !email || !password){
        return res.json({success:false,message:"Please fill all the fields"})
    }

    try{

        const existinguser=await usermodel.findOne({email})
        if(existinguser){
            return  res.json({success:false,message:"User already exists"})
        }
        const hashedpassword = await bcrypt.hash(password,10);

        const user= new usermodel({
            name,
            email,
            password:hashedpassword
        })

        await user.save();

        const token=jwt.sign({id:user._id}, process.env.JWT_SECRET,{expiresIn:'7d'});

        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'  ?'none':'strict',
            maxAge:7*24*60*60*1000
        });
        return res.json({success:true,message:"Login success"})
    }catch(error){
        res.json({success:false,message:error.message})
    }
}

export const login=async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.json({success:false,message:"email,password required"})
    }

    try {
        const user=await usermodel.findOne({email});
        if(!user){
            return res.json({success:false,message:"Invalid credentials"})
        }
        const ismatch=await bcrypt.compare(password,user.password);

        if(!ismatch){
            return res.json({success:false,message:"Invalid password"})
        }

        const token=jwt.sign({id:user._id}, process.env.JWT_SECRET,{expiresIn:'7d'});

        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'  ?'none':'strict',
            maxAge:7*24*60*60*1000
        });

        return res.json({success:true,message:"Login success"})

    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}