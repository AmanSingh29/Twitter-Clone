import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./home.css";
import { toast } from "react-toastify";

const Slider = () => {
  const [profilePic, setProfilePic] = useState("./images/default-profile.jpg");

  const logout = () => {
    toast.success("Logout succcessfully");
    localStorage.clear();
  };

  const userDetails = JSON.parse(localStorage.getItem("user"));

  //fetch user details
  const fetchUserDetails = () => {
    fetch(`http://localhost:5000/api/user/${userDetails.userid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfilePic(data.profilePicture);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchUserDetails();
  }, [profilePic]);

  return (
    <div>
      <div className="twit-home-logo">
        <i className="fa-brands fa-twitter"></i>
      </div>
      <Link to={"/home"} className="home-link">
        <i className="fa-solid fa-house"></i>
        <span>Home</span>
      </Link>
      <Link to={`/myprofile`} className="home-link">
        <i className="fa-solid fa-user"></i>
        <span>Profile</span>
      </Link>
      <Link to={"/"} className="home-link" onClick={() => logout()}>
        <i className="fa-solid fa-right-from-bracket"></i>
        <span>Logout</span>
      </Link>
      <div className="home-bottom">
        <div className="home-profile-pic">
          <img
            className="home-profile-pic"
            alt=""
            src={`http://localhost:5000/uploads/${profilePic}`}
          />
        </div>
        <div className="home-bottom-detail">
          <div>
            <b>{userDetails.name}</b>
          </div>
          <div>@{userDetails.username}</div>
        </div>
      </div>
    </div>
  );
};

export default Slider;
