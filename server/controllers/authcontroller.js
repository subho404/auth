
  import bcrypt from 'bcryptjs';
   import jwt from 'jsonwebtoken';
export const registered=async(req,res)=>{
    const {name,email,password}=req.body;


    if(!name || !email || !password){
        return res.json({success:false,message:"Please fill all the fields"})
    }

    try{
        const hashedpassword = await bcrypt.hash(password,10);
    }catch(error){
        res.json({success:false,message:error.message})
    }
}