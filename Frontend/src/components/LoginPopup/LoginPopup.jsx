import './LoginPopup.css';
import cross from '../../assets/cross_icon.png';
import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState("SignUp");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    const endpoint = currState === "Login" ? "login" : "register";
    const newUrl = `${url}/api/user/${endpoint}`;

    try {
      const response = await axios.post(newUrl, data);

      if (response.data.success) {
        if (currState === "Login") {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("👋 Welcome back!", {
            className: "custom-success-toast"
          });
          setShowLogin(false);
        } else {
          toast.success("🎉 Account created successfully! Please log in.", {
            className: "custom-success-toast"
          });
          // Clear form and switch to Login
          setData({
            name: "",
            email: "",
            password: ""
          });
          setTimeout(() => setCurrState("Login"), 1500);
        }
      } else {
        toast.error(response.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Full error details:", {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
      toast.error(`Login error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={cross} alt="close" />
        </div>
        <div className="login-popup-inputs">
          {currState !== "Login" && (
            <input
              name='name'
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}
          <input
            name='email'
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          <input
            name='password'
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password"
            required
          />
        </div>

        {/* ✅ Show checkbox only in SignUp mode */}
        {currState === "SignUp" && (
          <div className="login-popup-condition">
            <input type="checkbox" required />
            <p>By continuing, I agree to the terms of use & privacy policy.</p>
          </div>
        )}

        <button type='submit' disabled={loading}>
          {loading ? "Processing..." : (currState === "SignUp" ? "Create account" : "Login")}
        </button>

        {currState === "Login" ? (
          <p>Create a new account? <span onClick={() => setCurrState("SignUp")} className='spann'>Click here</span></p>
        ) : (
          <p>Already have an account? <span onClick={() => setCurrState("Login")} className='spann'>Login here</span></p>
        )}
      </form>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
    </div>
  );
};

export default LoginPopup;
