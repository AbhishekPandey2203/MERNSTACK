import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'

dotenv.config();

// Registration route handler
export const register = async (req, res) => {

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: "User Already Exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = new User({
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({ msg: "User created Successfully"});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ errors: "Internal Server Error" });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      let user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ msg: "User Not Found" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }
  
      const payload = {
        user: user._id,
      };
  
      // create a token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 360000,
      });
  
    //   //creating a cookie and
  
      res.cookie("token", token, { httOnly: true, expiresIn: 360000 });
  
      //passwrod
      // we have taken out the passwrod we dont snd the passwrod
    //   const { password: pass, ...rest } = user._doc;
  
      res.status(200).json({ msg: "User Logged In Successfully"});
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ errors: "Internal Server Error" });
    }
  };
  
  export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ msg: "User Logged Out Successfully"});
  };

