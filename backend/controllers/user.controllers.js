import asyncHandler from "express-async-handler";
import { User } from "../models/user.model.js";
import { generateToken } from "../db/generateToken.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if ([name, email, password].some((field) => field?.trim() === "")) {
    res.status(400);
    throw new Error("Please Enter all the Fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already Fields");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if(!user)
  {
     res.status(400);
     throw new Error("Failted to Create the User");
  }

    return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token : generateToken(user._id)
    });
});


const authUser = asyncHandler( async(req,res)=>
{
    const {email,password} = req.body ;

    const user = await User.findOne({email})

    
    if (!user) 
    {
        res.status(401)
        throw new Error("User does not exist") ;
    }

    const isPasswordValid = await user.matchPassword(password)
    if (!isPasswordValid) 
    {
        res.status(401)
        throw new Error("Invalid user credentials")
    }

     return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token : generateToken(user._id)
           });
   
})


const allUser  = asyncHandler(async(req,res)=>{

  const keyword = req.query.search
  ? {
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ],
    }
  : {};

 

   const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
   res.send(users);

})


export {registerUser,authUser,allUser} ;