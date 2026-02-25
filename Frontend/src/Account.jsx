import "./Account.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Account = () => {
    const [accountDetails, setAccountDetails] = useState({User: "", Email: "", password: ""});
    const {User, Email, password} = accountDetails;
    const navigate = useNavigate();

    useEffect(() => {
        if(!localStorage.getItem("token")){
          navigate("/login");
        }
      }, []);

    const getAccountDetails = async () => {
        try{
            const response = await axios.get(`http://localhost:8080/api/v1/account?token=${localStorage.getItem("token")}`);
            setAccountDetails({...accountDetails, 
                User: response.data.username,
                Email: response.data.email,
                password: response.data.password
            });
        }catch(err){
            console.log(err);
        }
    }
    
    useEffect(() => {
        if(localStorage.getItem("token")){
            getAccountDetails()
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    }

    return (
        <div className="userProfileContainer">
            <div className="back" onClick={() => navigate("/")}><i className="fa-solid fa-arrow-left"/><span>Back</span></div>
            <div className="Account">
                <h1><i className="fa-regular fa-circle-user"/> Account</h1>
                <h3>User: <input type="text" value={User} disabled/></h3>
                <h3>Email: <input type="text" value={Email} disabled/></h3>
                <h3>Password: <input type="password" value={password} disabled/></h3>
                <button onClick={handleLogout}>Log out</button>
            </div>
        </div>
    )
}