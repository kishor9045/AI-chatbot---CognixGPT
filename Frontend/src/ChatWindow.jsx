import "./ChatWindow.css";
import {Chat} from "./Chat.jsx";
import { useContext, useEffect, useState } from "react";
import {context} from "./Context.jsx";
import axios from "axios";
import {ScaleLoader} from "react-spinners";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

export const ChatWindow = () => {
    const {prompt, setPrompt, reply, setReply, currThreadId, setCurrThreadId, setPrevChats, setModelLimit, toggleSidebar, setToggleSidebar} = useContext(context);
    const [loading, setLoading] = useState(false);
    const [openModelDropdown, setOpenModelDropdown] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectCurrModel, setCurrSelectModel] = useState(0);
    const [model, setModel] = useState("google/gemma-3-4b-it:free");

    const navigate = useNavigate();
    

    const handlePromptSendAndGetReply = async () => {
        try{
            if(!localStorage.getItem("token")) return;

            setModelLimit(false);
            if(currThreadId && prompt && model && currThreadId !== "" && prompt !== "" && model !== ""){
                setLoading(true);
                const response = await axios.post("http://localhost:8080/api/v1/chat", {
                    threadId: currThreadId,
                    sendRequest: prompt,
                    model: model,
                    token: localStorage.getItem("token")
                });
                if(response.status === 200){
                    setReply(response.data.responseData);
                    setLoading(false);
                    setCurrThreadId(uuidv4());
                }
            }
        }catch(err){
            setModelLimit(true);
            setLoading(false);
            console.log(`Caught an error: ${err}`);
        }
    }

    useEffect(() => {
        if(prompt && reply){
            setPrevChats((prevChat) => (
                [...prevChat, {
                    role: "user",
                    content: prompt
                }, {
                    role: "assistant",
                    content: reply
                }]
            ));
            setPrompt("");
        }
    }, [reply])

    const handleModelDropdown = (modelIdx, model) => {
        if(modelIdx != undefined && model){
            setCurrSelectModel(modelIdx);
            setModel(model);
        }
    }

    useEffect(() => {
        const handleModelDropdownOutsideClick = (event) => {
            const modelContainer = document.querySelector(".modelContainer");
            const logoSpan = document.querySelector(".logoSpan");
            const dropdownContainer = document.querySelector(".dropdownContainer");
            const userIconDiv = document.querySelector(".userIconDiv");
            if(modelContainer && logoSpan && !modelContainer.contains(event.target) && !logoSpan.contains(event.target)){
                setOpenModelDropdown(false);
            }
            if(dropdownContainer && userIconDiv && !dropdownContainer.contains(event.target) && !userIconDiv.contains(event.target)){
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleModelDropdownOutsideClick);
        return () => document.removeEventListener("mousedown", handleModelDropdownOutsideClick);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    }

    return (
        <div className="chatWindow">
            <button className="sidebarToggleBtn" onClick={() => setToggleSidebar(!toggleSidebar)} style={toggleSidebar ? {display: "none"} : {}}><i className="fa-solid fa-bars"></i></button>
            <div className="navbar">
                <span  className="logoSpan" onClick={() => setOpenModelDropdown(!openModelDropdown)} style={{...(openModelDropdown && {backgroundColor: "#FFFFFF26"}), ...(!toggleSidebar && {marginLeft: "3.5rem"})}} title="CognixGPT">CognixGPT <i className="fa-solid fa-angle-down"></i></span>
                <div className="allModelsOuter">
                    <div className="modelContainer" style={openModelDropdown ? {display: "block"} : {display: "none"}}>
                        <ul>
                            <li onClick={() => handleModelDropdown(0, "google/gemma-3-4b-it:free")}><p>Google - gemma-3 v4 model</p> {selectCurrModel === 0 ? <i className="fa-solid fa-check"></i> : <></>}</li>
                            <li onClick={() => handleModelDropdown(1, "google/gemma-3-12b-it:free")}><p>Google - gemma-3 v12</p> {selectCurrModel === 1 ? <i className="fa-solid fa-check"></i> : <></>}</li>
                            <li onClick={() => handleModelDropdown(2, "google/gemma-3-27b-it:free")}><p>Google - gemma-3 v27</p> {selectCurrModel === 2 ? <i className="fa-solid fa-check"></i> : <></>}</li>
                            <li onClick={() => handleModelDropdown(3, "nvidia/nemotron-nano-12b-v2-vl:free")}><p>Nvidia - nemotron nano v2 model</p> {selectCurrModel === 3 ? <i className="fa-solid fa-check"></i> : <></>}</li>
                            <li onClick={() => handleModelDropdown(4, "liquid/lfm-2.5-1.2b-thinking:free")}><p>Liquid AI: lfm 2.5 - Thinking</p> {selectCurrModel === 4 ? <i className="fa-solid fa-check"></i> : <></>}</li>
                            <li onClick={() => handleModelDropdown(5, "arcee-ai/trinity-large-preview:free")}><p>Arcee AI: Trinity large</p> {selectCurrModel === 5 ? <i className="fa-solid fa-check"></i> : <></>}</li>
                            <li onClick={() => handleModelDropdown(6, "stepfun/step-3.5-flash:free")}><p>Step Fun 3.5 (new model)</p> {selectCurrModel === 6 ? <i className="fa-solid fa-check"></i> : <></>}</li>
                        </ul>
                    </div>
                </div>
                <div className="userIconDiv" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
                {
                    isDropdownOpen && 
                        <div className="dropdownContainer">
                            <div className="dropdown">
                                <ul>
                                    <li><i className="fa-solid fa-arrow-up-right-from-square" /> Upgrade plan</li>
                                    <li onClick={() => navigate("/settings")}><i className="fa-solid fa-gear"/> Settings</li>
                                    <li onClick={handleLogout}><i className="fa-solid fa-arrow-right-from-bracket"/> Log out</li>
                                </ul>
                            </div>
                        </div>
                }
                
            </div>
            <Chat/>
            <ScaleLoader color="#fff" loading={loading}/>
            <div className="chatInput">
                <div className="inputBox">
                    <input type="text" placeholder="Ask Anything..." value={prompt} pattern="\S+" onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' ? handlePromptSendAndGetReply() : ""}/>
                    <div className="submit" onClick={handlePromptSendAndGetReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <div className="info">
                    <p>CognixGPT can make mistakes. Check important info. See Cookie Preferences.</p>
                </div>
            </div>
        </div>
    )
};