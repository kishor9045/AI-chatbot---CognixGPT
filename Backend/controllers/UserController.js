import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import crypto from "crypto";

const register = async (req, res) => {
    try{
        const {username, Email, password} = req.body;
        if(!Email || !password){
            return res.status(httpStatus.UNAUTHORIZED).json({message: "Input fields are empty!"});
        }
        const existingUser = await User.findOne({Email});
        if(existingUser){
            return res.status(httpStatus.CONFLICT).json({message: "User already exists!"});
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const createUser = new User({
            username: username,
            Email: Email,
            password: hashedPassword
        });
        await createUser.save();
        res.status(httpStatus.CREATED).json({message: "User registered successful"});
    }catch(err){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: `Caught an error while register! ${err}`});
    }
};

const login = async (req, res) => {
    try{
        const {Email, password} = req.body;
        if(!Email || !password){
            return res.status(httpStatus.UNAUTHORIZED).json({message: "Input fields are empty!"});
        }
        const user = await User.findOne({Email});
        if(!user){
            return res.status(httpStatus.UNAUTHORIZED).json({message: "Incorrect user!"});
        }
        const comparePassword = await bcrypt.compare(password, user.password);
        if(!comparePassword){
            return res.status(httpStatus.UNAUTHORIZED).json({message: "Incorrect password!"});
        }
        const randomString = crypto.randomBytes(120).toString('hex');
        user.token = randomString;
        await user.save();
        res.status(httpStatus.OK).json({message: "User logged in successful", token: randomString});
    }catch(err){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: `Caught an error while login! ${err}`});
    }
};

const Account = async (req, res) => {
    try{
        const {token} = req.query;
        if(!token){
            return res.status(httpStatus.UNAUTHORIZED).json({message: "Token is empty!"});
        }
        const user = await User.findOne({token});
        if(!user){
            return res.status(httpStatus.NOT_FOUND).json({message: "User not found!"});
        }
        res.status(httpStatus.OK).json({username: user.username, email: user.Email, password: user.password});
    }catch(err){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: `Caught an error whild login! ${err}`});
    }
}

export {register, login, Account};