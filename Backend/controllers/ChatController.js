import httpStatus from "http-status";
import Thread from "../models/ThreadModel.js";
import { GetModelResponse } from "../utils/ModelResponse.js";
import User from "../models/UserModel.js";

const getAllThreads = async (req, res) => {
    try{
        const {token} = req.body;
        if(!token){
            return res.status(httpStatus.BAD_REQUEST).json({message: "Token not found!"});
        }
        const user = await User.findOne({token});
        if(!user){
            return res.status(httpStatus.NOT_FOUND).json({message: "user not found!"});
        }
        const allThreads = await Thread.find({userId: user.Email}).sort({updatedAt: -1}); //Sort the thread in a descending order
        if(!allThreads){
            return res.status(httpStatus.NOT_FOUND).json({message: "Threads not found with the give token!"});
        }
        res.json(allThreads);
    }catch(err){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: `Caught an error while getting threads!: ${err}`});
    }
};

const getThreadMessagage = async (req, res) => {
    try{
        const {threadId} = req.params;
        const {token} = req.body;
        if(!threadId && !token){
            return res.status(httpStatus.BAD_REQUEST).json({message: "ThreadId or token is undefined!"});
        }
        const user = await User.findOne({token});
        if(!user){
            return res.status(httpStatus.BAD_REQUEST).json({message: "user not found!"});
        }
        const thread = await Thread.findOne({userId: user.Email, threadId});
        if(!thread){
            return res.status(httpStatus.NOT_FOUND).json({message: "Thread not found with the give Id!"});
        }
        res.status(httpStatus.OK).json({threadMessages: thread.messages});
    }catch(err){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: `Caught an error!: ${err}`});
    }
};

const deleteThread = async (req, res) => {
    try{
        const {threadId} = req.params;
        const {token} = req.query;
        if(!token){
            return res.status(httpStatus.BAD_REQUEST).json({message: "Token not found!"});
        }
        if(!threadId){
            return res.status(httpStatus.BAD_REQUEST).json({message: "Thread's id is undefined!"});
        }
        const user = await User.findOne({token});
        if(!user){
            return res.status(httpStatus.NOT_FOUND).json({message: "User not found!"});
        }
        const deletedThread = await Thread.findOneAndDelete({userId: user.Email, threadId: threadId});
        if(!deletedThread){
            return res.status(httpStatus.NOT_FOUND).json({message: "Thread not found with the give Id!"});
        }
        res.status(httpStatus.OK).json({message: "Deleted successful!"});
    }catch(err){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: `Caught an error!: ${err}`});
    }
};

const createThread = async (req, res) => {
    try{
        const {threadId, sendRequest, model, token} = req.body;
        if(!threadId || !sendRequest || !model || !token){
            return res.status(httpStatus.BAD_REQUEST).json({message: "Request details is undefined!"});
        }
        let user = await User.findOne({token});
        if(!user){
            return res.status(httpStatus.BAD_REQUEST).json({message: "User Token is undefined!"});
        }
        let thread = await Thread.findOne({userId: user.Email, threadId});
        if(!thread){
            thread = new Thread({
                userId: user.Email,
                threadId: threadId,
                title: sendRequest,
                messages: [{role: "user", content: sendRequest}]
            });
        } else{
            thread.messages.push({role: "user", content: sendRequest});
        }
        const modelResponse = await GetModelResponse(sendRequest, model);
        if(!modelResponse){
            return res.status(httpStatus.NO_CONTENT).json({message: "Response is undefined!"});
        }
        thread.messages.push({role: "assistant", content: modelResponse});
        thread.updatedAt = new Date();
        await thread.save();
        res.status(httpStatus.OK).json({message: "Got the model response successful", responseData: modelResponse});
    }catch(err){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:`Caught an error! ${err}`});
    }
};

export {getAllThreads, getThreadMessagage, deleteThread, createThread};