import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    phone:{
        type:Number,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    post:{
        type:Schema.Types.ObjectId,
        ref:"Post"
    }

},{
    timestamps:true
})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}



const User = mongoose.model("User",userSchema)
export default User
 