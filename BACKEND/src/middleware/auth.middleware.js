import jwt from 'jsonwebtoken'
import User from '../models/User.models.js';




const jwtVerify = async (req,res,next)=>{

  try {
          const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ","")
     
          if(!token){
            return res.status(401).json({message: "Unauthorized Request"});
          }
      
          const tokenUser = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
      
          if(!tokenUser){
            return res.status(401).json({message: "Unauthorized Request"});

          }
      
          const user = await User.findById(tokenUser._id).select("-password")
         
          if(!user){
            return res.status(401).json({message: "Unauthorized Request"});

          }
      
          req.user = user
          next()
  } catch (error) {
    return res.status(500).json({error,message: error.message});
  }


}




export {jwtVerify}