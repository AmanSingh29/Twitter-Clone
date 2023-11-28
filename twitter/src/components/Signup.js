import React, { useState } from "react";
import "./login.css";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../serverConfig";

const Signup = () => {
  const navigate = useNavigate();

  //usestate define
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //to check a valid email
  // eslint-disable-next-line
  const checkEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  //whaen a user submit register form
  const postData = (e) => {
    e.preventDefault();

    if (!checkEmail.test(email)) {
      toast.error("Invalid email!", {
        position: "top-center",
      });
      return;
    }

    fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: name,
        username: username,
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error, {
            position: "top-center",
          });
        } else {
          toast.success(data.success, {
            position: "top-center",
          });
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="form-cont">
      <div className="row log-form shadow">
        <div className="col-5 logo-col">
          <h3 style={{ color: "aliceblue" }}>Join Us</h3>
          <i className="fa-brands fa-twitter"></i>
        </div>
        <div className="col-7 form-col">
          <form onSubmit={(e) => postData(e)}>
            <h2 className="fw-bold">Register</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              placeholder="Fullname"
            />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              placeholder="Username"
            />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Password"
            />
            <button className="btn btn-dark">Singup</button>
            <p className="my-3">
              Already registered? <Link to={"/"}>Login here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
