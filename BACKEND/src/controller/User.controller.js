import User from "../models/User.models.js";
import Post from "../models/Post.models.js";
import cloudinary from "../utils/cloudinary.js";
import {getDistanceInMeters} from "../utils/helperFunc.js"

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


const createPost = async (req, res) => {
  try {
    const { title, description, category, status, lat, lng, isAnonymous } = req.body;

    if (!req.files || !req.files.image)
      return res.status(401).json({message: "Image is required"}); 

    if (!title || !description || !category )
     return res.status(401).json({message: "All feilds are required"}); 

    if (!lat || !lng)
      return res.status(401).json({message: "Required Location Access"}); 


    const result = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      {
        folder: "civic-tracker/posts",
      }
    );

    const newPost = await Post.create({
      title,
      description,
      category,
      status: status || "open",
      image: result.secure_url,
      author: req.user._id,
      isAnonymous: isAnonymous || false,
      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
    });


    await User.findByIdAndUpdate(req.user._id, {
      $set: { post: newPost._id },
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
     res.status(500).json({error,message: error.message});
  }
};

const getPost = async (req, res) => {
  try {
    const {
      lat,
      lng,
      category = "All Categories",
      status = "All Status",
      distance = "All Distances"
    } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and Longitude are required." });
    }

    const query = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: getDistanceInMeters(distance),
        },
      },
    };

    if (category !== "All Categories") {
      query.category = category;
    }

    if (status !== "All Status") {
      query.status = status
    }

    const posts = await Post.find(query).populate("author", "-password");

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
};

export { register, login, createPost ,getPost};
