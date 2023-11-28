import React, { useState, useEffect } from "react";
import "./login.css";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../serverConfig";

const Login = () => {
  //usestates defines
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  //useeffect hook
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      navigate("/home");
    }
  }, []);

  //when a user submit a login form
  const logSubmit = (e) => {
    e.preventDefault();
    fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error("Please check username or password!");
        } else {
          toast.success("Login successfully");
          navigate("/home");
          localStorage.setItem("jwt", data.result.authtoken);
          localStorage.setItem("user", JSON.stringify(data.result.userData));
        }
      });
  };

  return (
    <div className="form-cont">
      <div className="row log-form shadow">
        <div className="col-5 logo-col">
          <h3 style={{ color: "aliceblue" }}>Welcome Back</h3>
          <i className="fa-brands fa-twitter"></i>
        </div>
        <div className="col-7 form-col">
          <form onSubmit={(e) => logSubmit(e)} className="py-5">
            <h2 className="fw-bold">Log in</h2>
            <input
              type="text"
              className="form-input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              className="form-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btn-dark">Login</button>
            <p className="my-3">
              Doesn't have an account? <Link to={"/signup"}>Signup</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
