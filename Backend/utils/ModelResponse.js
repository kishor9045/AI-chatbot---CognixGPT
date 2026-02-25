import axios from "axios";
import "dotenv/config";

export const GetModelResponse = async (message, model) => {
    try{
        if(!message){
            return "message is undefined!";
        }
        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            model: model,
            messages: [
                {
                    role: "user",
                    content: message
                }
            ]
        }, {
            headers: {
                Authorization: process.env.OPEN_ROUTER_API_KEY
            }
        })
        if(response.status === 200){
            return response.data.choices[0].message.content;
        }
    }catch(err){
        throw err;
    }
};