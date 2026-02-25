import "./Login.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {ToastContainer,toast, Bounce} from "react-toastify";

export const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPass, setShowConfirmPassword] = useState(false);
    const [toggleLoginSignup, setToggleLoginSignup] = useState(0);
    const [formDetails, setFormDetails] = useState({name: "", email: "", password: "", confirmPassword: ""});

    const {name, email, password, confirmPassword} = formDetails;
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("token")){
            navigate("/");
        }
    }, []);

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

    const handleError = (message) => {
        toast.error(message, {
            position: "bottom-left",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        try{
            if(toggleLoginSignup === 0){
                if(email && password && email !== "" && password !== ""){
                    const login = await axios.post("http://localhost:8080/api/v1/login", {
                        username: name,
                        Email: email,
                        password: password
                    });
                    if(login.status === 200){
                        localStorage.setItem("token", login.data.token);
                        handleSuccess(login.data.message);
                        setTimeout(() => {
                            navigate("/");
                        }, 1500);
                    } else{
                        handleError(login.data.message);
                    }
                };
            } else if(toggleLoginSignup === 1){
                if(email && password && email !== "" && password !== ""){
                    if(password === confirmPassword){
                        const register = await axios.post("http://localhost:8080/api/v1/register", {
                            username: name,
                            Email: email,
                            password: password
                        });
                        if(register.status === 201){
                            handleSuccess(register.data.message);
                            setToggleLoginSignup(0);
                        } else{
                            handleError(register.data.message);
                        }
                    }else{
                        handleError("Password is not same!");
                    }
                }
            }
        }catch(err){
            handleError(err.response.data.message);
        }
    }
    
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormDetails({...formDetails, [name]: value});
    }

    return (
        <div className="LoginContainer">
            <div className="LoginBox">
                <h2>CognixGPT</h2>
                <form className="loginInputBox">
                    <input type="text" placeholder="Username" name="name" autoComplete="off" onChange={handleChange} value={name} onKeyDown={(e) => e.key === "Enter" ? handleAuth : ""} required/>
                    <input type="email" placeholder="Email address" name="email" autoComplete="off" onChange={handleChange} value={email} onKeyDown={(e) => e.key === "Enter" ? handleAuth : ""} required/>
                    <input type={showPassword ? "text" : "password"} placeholder="Password" name="password" onChange={handleChange} value={password} autoComplete="off" onKeyDown={(e) => e.key === "Enter" ? handleAuth : ""} required/>
                    <div className="showpasswordContainer">
                        <div className="showPassword" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <i className="fa-regular fa-eye-slash"></i> : <i className="fa-regular fa-eye"></i>}
                        </div>
                    </div>
                    {
                        toggleLoginSignup === 1 &&
                            <>
                                <input type={showConfirmPass ? "text" : "password"} placeholder="Confirm password" name="confirmPassword" onChange={handleChange} value={confirmPassword} onKeyDown={(e) => e.key === "Enter" ? handleAuth : ""} autoComplete="off" required/>
                                <div className="showpasswordContainer">
                                    <div className="showPassword" onClick={() => setShowConfirmPassword(!showConfirmPass)}>
                                    {showConfirmPass ? <i className="fa-regular fa-eye-slash"></i> : <i className="fa-regular fa-eye"></i>}
                                    </div>
                                </div>
                            </>
                    }
                    <div className="forgetPass">
                        <a href="#">Forgot password?</a>
                        <a href="#" onClick={() => setToggleLoginSignup(1)}> Sign up</a>
                    </div>
                    <button className="loginBtn" onClick={handleAuth}>{toggleLoginSignup === 1 ? "Signup" : "Login"}</button>
                    {
                       toggleLoginSignup === 1 && 
                            <div className="moveToLoginDiv">
                                <button onClick={() => setToggleLoginSignup(0)}>Login</button>
                            </div>
                    }
                </form>
            </div>
            <ToastContainer position="bottom-left" autoClose={500} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" transition={Bounce} />
        </div>
    )
}