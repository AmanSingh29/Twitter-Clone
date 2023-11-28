import React, { useState, useEffect } from "react";
import { BASE_URL } from "../serverConfig";

const Retweet = ({ Id }) => {
  const [userData, setUserData] = useState([]);

  const fetchUserDetails = () => {
    fetch(`${BASE_URL}/api/user/${Id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <span className="my-0" style={{ fontSize: "14px" }}>
      {" "}
      @{userData.username},{" "}
    </span>
  );
};

export default Retweet;
