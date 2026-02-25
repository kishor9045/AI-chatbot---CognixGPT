import './App.css'
import {Sidebar} from "./Sidebar.jsx";
import {ChatWindow} from "./ChatWindow.jsx";
import { context } from './Context.jsx';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {v4 as uuidv4} from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv4());
  const [prevChats, setPrevChats] = useState([]);
  const [allThreads, setAllThreads] = useState([]);
  const [modelLimit, setModelLimit] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(true);

  const providerValues = {
      prompt, setPrompt,
      reply, setReply, 
      currThreadId, setCurrThreadId, 
      prevChats, setPrevChats,
      allThreads, setAllThreads,
      modelLimit, setModelLimit,
      toggleSidebar, setToggleSidebar
  };

  const navigate = useNavigate();

  useEffect(() => {
    if(!localStorage.getItem("token")){
      navigate("/login");
    }
  }, []);

  return (
    <div className="main">
      <context.Provider value={providerValues} >
        <Sidebar />
        <ChatWindow />
      </context.Provider>
    </div>
  )
}

export default App
