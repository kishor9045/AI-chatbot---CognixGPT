import "./Sidebar.css";
import { context } from "./Context";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import {ToastContainer,toast, Bounce} from "react-toastify";

export const Sidebar = () => {
    const {allThreads, setAllThreads, currThreadId, setCurrThreadId, setPrevChats, setPrompt, setReply, toggleSidebar, setToggleSidebar} = useContext(context);
    const [showSidebarIcon, setShowSidebarIcon] = useState(false);

    const handleSuccess = (message) => {
            toast.success(message, {
            position: "bottom-left",
            autoClose: 500,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
    };

    const getAllThreads = async () => {
        try{
            if(!localStorage.getItem("token")) return;
            const response = await axios.post("http://localhost:8080/api/v1/thread", {
                token: localStorage.getItem("token")
            });
            if(response.status === 200){
                const filteredData = response.data.map((data) => ({threadId: data.threadId, title: data.title}));
                setAllThreads(filteredData);
            }
        }catch(err){
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);

    const handlePrevChats = async (threadId) => {
        setCurrThreadId(threadId);
            try{
                if(!localStorage.getItem("token")) return;

                const response = await axios.post(`http://localhost:8080/api/v1/thread/${threadId}`, {
                    token: localStorage.getItem("token")
                });
                if(response.status === 200){
                    setPrevChats(response.data.threadMessages);
                    setReply(null);
                }
            }catch(err){
                console.log(err);
            }
    }

    const deleteThread = async (threadId) => {
        try{
            if(!localStorage.getItem("token")) return;
            const token = localStorage.getItem("token");
            const response = await axios.delete(`http://localhost:8080/api/v1/thread/${threadId}?token=${token}`);
            handleSuccess(response.data.message);
            setCurrThreadId(uuidv4());
            setPrevChats([]);
        }catch(err){
            console.log(err);
        }
    }

    return (
        <section className={`sidebar ${toggleSidebar ? "openSidebar" : "closeSidebar"}`}>
            <div className="newSidebarBtn" >
                <img src={showSidebarIcon ? "/sidebarImg.png" : "/logo3.png"} alt="logoImg" className={`logo ${showSidebarIcon ? "sidebarIconLogo" : "logo"}`} onMouseEnter={() => setShowSidebarIcon(true)} onMouseLeave={() => setShowSidebarIcon(false)} onClick={() => setToggleSidebar(!toggleSidebar)}/>
                <button onClick={() => {setPrevChats([]); setPrompt(""); setReply(null); setCurrThreadId(uuidv4());}} title="New Chat"><i className="fa-regular fa-pen-to-square"></i></button>
            </div>
            <ul className="history">
                {
                    allThreads.length > 0 ? allThreads?.map((thread, idx) => (
                        <li key={idx} onClick={() => handlePrevChats(thread.threadId)} title={thread.title} className={thread.threadId === currThreadId ? "highlighter" : ""}>
                            {thread.title.length > 26 ? thread.title.slice(0, 26) + "..." : thread.title}
                            <i className="fa-solid fa-trash" title="Delete" onClick={(e) => {e.stopPropagation(); deleteThread(thread.threadId);}}/>
                        </li>
                    )) : <p style={{textAlign: "center", fontSize: "14px"}}>No chat messages yet!</p>
                }
            </ul>
            <div className="sign">
                <p>By Coginx with &#10084;</p>
            </div>
            <ToastContainer position="bottom-left" autoClose={500} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" transition={Bounce} />
        </section>
    )
};