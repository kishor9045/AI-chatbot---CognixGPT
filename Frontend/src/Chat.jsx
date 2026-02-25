import "./Chat.css";
import {context} from "./Context.jsx";
import { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export const Chat = () => {
    const {prevChats, reply, modelLimit} = useContext(context);
    const [latestReply, setLatestReply] = useState(null);
    
    useEffect(() => {
        if(reply === null){
            setLatestReply(null);
            return;
        };
        if(!prevChats?.length) return;
        const content = reply.split(" ");
        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx + 1).join(" "));
            idx++;
            if(idx > content.length) clearInterval(interval);
        }, 40);
        return () => clearInterval(interval);
    }, [prevChats, reply]);

    return (
        <div className="chatOuterContainer">
            <div className="chats">
                {
                    prevChats.length > 0 ? prevChats?.slice(0, -1).map((prevChat, idx) => (
                        <div className={prevChat.role === "user" ? "userDiv": "gptDiv"} key={idx}>
                            {prevChat.role === "user" ? 
                                <p className={"userMsg"}>{prevChat.content}</p> : 
                                <ReactMarkdown rehypePlugins={rehypeHighlight}>{prevChat.content}</ReactMarkdown>
                            }
                        </div>
                    )) : <h1 style={modelLimit ? {display: "none"} : {display: "block", height: "160px"}}>What can i help with?</h1>
                }
                {
                    prevChats.length > 0 && (
                        <>
                            {
                                latestReply !== null ? (
                                    <div className="gptDiv" key={"typing"}>
                                        <ReactMarkdown rehypePlugins={rehypeHighlight}>{latestReply}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <div className="gptDiv" key={"lastReply"}>
                                        <ReactMarkdown rehypePlugins={rehypeHighlight}>{prevChats[prevChats.length - 1].content}</ReactMarkdown>
                                    </div>
                                )
                            }
                        </>

                    )
                }
                {
                    modelLimit && 
                        <>
                          <p style={modelLimit && {fontSize: "14px", color: "#F44336"}}> Too many requests! Unable to proceed with the request! As your model request limit is exceeded!</p>
                        </>
                }
            </div>
        </div>
    )
}