import React, { useEffect, useState } from "react";
import "./profile.css";
import "./home.css";
import moment from "moment";
import { toast } from "react-toastify";
import Slider from "./Slider";
import { useParams, useNavigate } from "react-router-dom";
import Retweet from "./Retweet";
import { BASE_URL } from "../serverConfig";

const MyProfile = () => {
  const navigate = useNavigate();

  const userDetails = JSON.parse(localStorage.getItem("user"));

  //usestates hooks
  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState({});
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [userData, setUserData] = useState([]);
  const [followNum, setFollowNum] = useState([]);
  const [followingNum, setFollowingNum] = useState([]);
  const [tweetId, setTweetId] = useState("");
  const [reply, setReply] = useState([]);
  const [userProfile, setUserProfile] = useState("");

  const CONFIG = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("jwt"),
  };

  //function to fetch user details
  const fetchUserTweets = () => {
    fetch(`${BASE_URL}/api/${userDetails.userid}/usertweet`, {
      method: "GET",
      headers: CONFIG,
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => console.log(error));
  };

  //function to delete a tweet
  const deletePost = (postId) => {
    fetch(`${BASE_URL}/api/tweet/${postId}`, {
      method: "DELETE",
      headers: CONFIG,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("Tweet deleted successfully");
          fetchUserTweets();
        }
      });
  };

  //fetch user details
  const fetchUserDetails = () => {
    fetch(`${BASE_URL}/api/user/${userDetails.userid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUserData(data);
        setFollowNum(data.followers);
        setFollowingNum(data.following);
        setUserProfile(data.profilePicture);
      })
      .catch((error) => console.log(error));
  };

  //function to like a tweet
  const likePost = (postId) => {
    fetch(`${BASE_URL}/api/tweet/${postId}/like`, {
      method: "POST",
      headers: CONFIG,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Tweet liked successfully");
          fetchUserTweets();
        }
      })
      .catch((error) => console.log(error));
  };

  //function to dislike a tweet
  const disLikePost = (postId) => {
    fetch(`${BASE_URL}/api/tweet/${postId}/dislike`, {
      method: "POST",
      headers: CONFIG,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Tweet disliked successfully");
          fetchUserTweets();
        }
      })
      .catch((error) => console.log(error));
  };

  //preview photo
  var previewImg = (e) => {
    const img = e.target.files[0];
    var output = document.getElementById("output");
    output.src = URL.createObjectURL(e.target.files[0]);
    setImage(img);
  };

  //update profile pic
  const uploadProfilePic = async () => {
    let formdata = new FormData();
    formdata.append("file", image);
    fetch(`${BASE_URL}/api/user/${userDetails.userid}/uploadProfilePic`, {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("jwt"),
      },
      body: formdata,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("ProfilePic Updated successfully");
          fetchUserDetails();
        }
      });
  };

  //update user profile
  const updateProfile = () => {
    fetch(`${BASE_URL}/api/user/${userDetails.userid}/`, {
      method: "PUT",
      headers: CONFIG,
      body: JSON.stringify({
        newName: name,
        newLocation: location,
        newDob: dateOfBirth,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("Profile Updated Successfully");
          fetchUserDetails();
        }
      })
      .catch((error) => console.log(error));
    setName("");
    setDateOfBirth("");
    setLocation("");
  };

  const navigateTweet = (postId) => {
    navigate(`/tweet/${postId}`);
  };

  const giveTweetId = (postId) => {
    setTweetId(postId);
  };

  //reply a tweet
  const handleReply = () => {
    fetch(`${BASE_URL}/api/tweet/${tweetId}/reply`, {
      method: "POST",
      headers: CONFIG,
      body: JSON.stringify({
        content: reply,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("Replied Successfully");
          fetchUserTweets();
        }
      })
      .catch((error) => console.log(error));
  };

  //retweet a tweet
  const handleRetweet = (postId) => {
    fetch(`${BASE_URL}/api/tweet/${postId}/retweet`, {
      method: "POST",
      headers: CONFIG,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Tweet Retweeted Successfully");
          fetchUserTweets();
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchUserTweets();
    fetchUserDetails();
  }, []);

  return (
    <div className="row profile-row">
      {/* edit profile modal */}
      <div
        className="modal fade"
        id="editModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit Profile
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="form-floating my-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                  placeholder="Leave a comment here"
                  id="floatingTextarea2"
                ></input>
                <label htmlFor="floatingTextarea2">Enter new name</label>
              </div>
              <div className="form-floating my-2">
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="form-control"
                  placeholder="Leave a comment here"
                  id="floatingTextarea2"
                ></input>
                <label htmlFor="floatingTextarea2">Enter location</label>
              </div>
              <div className="form-floating my-2">
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="form-control"
                  placeholder="Leave a comment here"
                  id="floatingTextarea2"
                ></input>
                <label htmlFor="floatingTextarea2">Enter date of birth</label>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                onClick={() => updateProfile()}
                type="button"
                data-bs-dismiss="modal"
                className="btn btn-primary"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* modal for profile pic update */}
      <div
        className="modal fade"
        id="profilePicModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Update Profile Pic
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="file"
                name="file"
                accept="image/*"
                onChange={(e) => previewImg(e)}
              />
              <div className="tweet-upload-pic">
                <img id="output" alt="" />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                onClick={() => uploadProfilePic()}
                type="button"
                data-bs-dismiss="modal"
                className="btn btn-primary"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for reply on a tweet */}
      <div
        className="modal fade"
        id="replyModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Tweet your reply
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="form-floating">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  className="form-control"
                  placeholder="Leave a comment here"
                  id="floatingTextarea2"
                  style={{ height: "120px" }}
                ></textarea>
                <label htmlFor="floatingTextarea2">Add your reply</label>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                onClick={() => handleReply()}
                type="button"
                data-bs-dismiss="modal"
                className="btn btn-primary"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-4 home-link-col">
        <Slider />
      </div>
      <div className="col-8 home-tweet-col">
        <div className="profile-top">
          <div className="profile-top-content">
            <img
              alt=""
              src={`${BASE_URL}/uploads/${userData.profilePicture}`}
            />
            <div className="profile-buttons">
              <button data-bs-toggle="modal" data-bs-target="#profilePicModal">
                Upload Profile Photo
              </button>
              <button data-bs-toggle="modal" data-bs-target="#editModal">
                Edit
              </button>
            </div>
          </div>
        </div>
        <div className="profile-user-details">
          <p className="fs-5">{userData.fullName}</p>
          <b>@{userData.username}</b>
          <p className="my-1">Location : {userData.location}</p>
          <p className="my-1">
            DOB : {moment(userData.dateOfBirth).calendar()}
          </p>
          <p className="my-1">
            <i className="fa-regular fa-calendar"></i> joined At :{" "}
            {moment(userData.createdAt).calendar()}
          </p>
          <span className="fw-bold me-2">{followingNum.length} Following</span>|
          <span className="fw-bold ms-2">{followNum.length} Followers</span>
        </div>
        <p className="text-center fw-bold fs-6 my-2">Tweets and Replies</p>
        {posts.map((post) => {
          return (
            <div className="row tweet-card" key={post._id}>
              {post.reTweetedBy.length > 0 ? (
                <div>
                  Retweeted By:
                  {post.reTweetedBy.map((res) => {
                    return <Retweet key={res} Id={res} />;
                  })}
                </div>
              ) : (
                ""
              )}
              {post.tweetedBy._id === userDetails.userid ? (
                <div className="del-btn">
                  <i
                    onClick={(e) => deletePost(post._id)}
                    className="fa-solid fa-trash-can"
                  ></i>
                </div>
              ) : (
                ""
              )}

              <div className="col-1" style={{ marginRight: "17px" }}>
                <div className="home-profile-pic">
                  <img
                    className="home-profile-pic"
                    alt=""
                    src={`${BASE_URL}/uploads/${userData.profilePicture}`}
                  />
                </div>
              </div>
              <div className="col-10 tweet-card-col">
                <div style={{ marginBottom: "13px" }}>
                  <b>@{post.tweetedBy.username}</b> - {post.createdAt}
                </div>
                <div
                  onClick={(e) => navigateTweet(post._id)}
                  className="tweete-detail"
                >
                  <p>{post.content}</p>
                  <div className="tweet-image">
                    <img alt="" src={post.image} />
                  </div>
                </div>
                <span>{post.likes.length}</span>
                {post.likes.includes(userDetails.userid) ? (
                  <i
                    onClick={(e) => disLikePost(post._id)}
                    className="fa-solid fa-heart liked-tweet"
                    style={{ color: "#f51414" }}
                  ></i>
                ) : (
                  <i
                    onClick={(e) => likePost(post._id)}
                    className="fa-regular fa-heart like-tweet"
                  ></i>
                )}
                <span>{post.replies.length}</span>
                <i
                  onClick={(e) => giveTweetId(post._id)}
                  className="fa-regular fa-comment comment-tweet"
                  data-bs-toggle="modal"
                  data-bs-target="#replyModal"
                ></i>
                <span>{post.reTweetedBy.length}</span>
                <i
                  onClick={(e) => handleRetweet(post._id)}
                  className="fa-solid fa-retweet retweet-tweet"
                ></i>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyProfile;
