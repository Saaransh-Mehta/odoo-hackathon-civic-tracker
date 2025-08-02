import User from "../models/User.models.js";

const register = async (req, res) => {
  try {
    const { username, password, email, phone } = req.body;
    if (!username || !password || !email || !phone) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    if (
      !String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }

    const existedUserEmail = await User.findOne({ email });
    if (existedUserEmail) {
      res.status(401).json({ message: "User with same email exists" });
      return;
    }

    const existedUserUsername = await User.findOne({ username });

    if (existedUserUsername) {
      res.status(401).json({ message: "Username already taken" });
      return;
    }

   const user = await User.create({ username, password, email, phone });


    if (!user) {
      res.status(500).json({ message: "Error while creating user" });
      return;
    }
    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};

const login = async (req,res)=>{
  try {
    const {username,password} = req.body;
    if(!username || !password){
      return res.status(401).json({message: "Username Or Password Required"});
    }
    
    const user = await User.findOne({username})
    if(!user){
     return res.status(401).json({message: "Invalid Username"});
    }
  
    const isPassword = await user.isPasswordCorrect(password)
  
    if(!isPassword){
      return res.status(401).json({message: "Invalid Credential"});
    }

    const token = await user.generateAccessToken()
    const option = {
      httpOnly:true,
      secure:true
     }

     const sendUser = await User.findOne({username}).select("-password -role ")
  
     return res.status(200).cookie("accessToken",token,option).json(sendUser)
  } catch (error) {
    res.status(500).json({error,message: error.message});
    // console.log(error)
  
  }

}


export { register ,login};
