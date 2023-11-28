import React, { useState, useEffect } from "react";
import "./home.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Slider from "./Slider";
import axios from "axios";
import Retweet from "./Retweet";
import moment from "moment";

const Home = () => {
  const navigate = useNavigate();

  //all states defined
  const [content, setContent] = useState("");
  const [image, setImage] = useState({ imgData: "" });
  const [data, setData] = useState([]);
  const [reply, setReply] = useState([]);
  const [tweetId, setTweetId] = useState("");

  //useeffect hook
  useEffect(() => {
    if (localStorage.getItem("jwt" && "user")) {
      fetchAllTweets();
    } else {
      navigate("/signup");
    }
  }, []);

  const userDetails = JSON.parse(localStorage.getItem("user"));

  //function to fetch all tweets
  const fetchAllTweets = () => {
    fetch("http://localhost:5000/api/tweet/", {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result);
      })
      .catch((error) => console.log(error));
  };

  const CONFIG = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("jwt"),
  };

  //to preview image on selection
  var previewImg = (e) => {
    var output = document.getElementById("output");
    const img = { imgData: e.target.files[0] };
    output.src = URL.createObjectURL(e.target.files[0]);
    setImage(img);
  };

  //to upload image
  const handleFileUpload = async () => {
    if (image.imgData) {
      let formdata = new FormData();
      formdata.append("file", image.imgData);
      const response = await axios.post(
        "http://localhost:5000/api/uploadFile",
        formdata
      );
      return response;
    }
  };

  //function to tweet a post
  const tweetPost = async () => {
    const imgRes = await handleFileUpload();
    console.log(imgRes);
    if (imgRes) {
      fetch("http://localhost:5000/api/tweet", {
        method: "POST",
        headers: CONFIG,
        body: JSON.stringify({
          content: content,
          image: `${imgRes.data.fileName}`,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success("Tweeted successfully");
            fetchAllTweets();
          }
        });
    } else {
      fetch("http://localhost:5000/api/tweet", {
        method: "POST",
        headers: CONFIG,
        body: JSON.stringify({
          content: content,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success("Tweeted successfully");
            fetchAllTweets();
          }
        });
    }
    setContent("");
    var output = document.getElementById("output");
    output.src = "";
    setImage({ imgData: "" });
  };

  //retweet a tweet
  const handleRetweet = (postId) => {
    fetch(`http://localhost:5000/api/tweet/${postId}/retweet`, {
      method: "POST",
      headers: CONFIG,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Tweet Retweeted Successfully");
          fetchAllTweets();
        }
      })
      .catch((error) => console.log(error));
  };

  //function to delete a tweet
  const deletePost = (postId) => {
    fetch(`http://localhost:5000/api/tweet/${postId}`, {
      method: "DELETE",
      headers: CONFIG,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("Tweet deleted successfully");
          fetchAllTweets();
        }
      });
  };

  //function to like a tweet
  const likePost = (postId) => {
    fetch(`http://localhost:5000/api/tweet/${postId}/like`, {
      method: "POST",
      headers: CONFIG,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Tweet liked successfully");
          fetchAllTweets();
        }
      })
      .catch((error) => console.log(error));
  };

  //function to dislike a tweet
  const disLikePost = (postId) => {
    fetch(`http://localhost:5000/api/tweet/${postId}/dislike`, {
      method: "POST",
      headers: CONFIG,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Tweet disliked successfully");
          fetchAllTweets();
        }
      })
      .catch((error) => console.log(error));
  };

  const navigateTweet = (postId) => {
    navigate(`/tweet/${postId}`);
  };

  const giveTweetId = (postId) => {
    setTweetId(postId);
  };

  //reply a tweet
  const handleReply = () => {
    fetch(`http://localhost:5000/api/tweet/${tweetId}/reply`, {
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
          fetchAllTweets();
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="row home-page">
      {/* Modal for new tweet  */}
      <div
        className="modal fade"
        id="tweetModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                New Tweet
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
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="form-control"
                  placeholder="Leave a comment here"
                  id="floatingTextarea2"
                  style={{ height: "120px" }}
                ></textarea>
                <label htmlFor="floatingTextarea2">write your tweet</label>
              </div>
              <input
                type="file"
                accept="image/*"
                className="upload-pic-input"
                onChange={(e) => previewImg(e)}
              />
              <i className="fa-regular fa-image"></i>
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
                onClick={() => tweetPost()}
                type="button"
                data-bs-dismiss="modal"
                className="btn btn-primary"
              >
                Tweet
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
        <div className="tweet-btn-row">
          <b>Home</b>
          <button data-bs-toggle="modal" data-bs-target="#tweetModal">
            Tweet
          </button>
        </div>
        {data.map((posts, index) => {
          return (
            <div className="row tweet-card" key={index}>
              {posts.reTweetedBy.length > 0 ? (
                <div>
                  Retweeted By:
                  {posts.reTweetedBy.map((res) => {
                    return <Retweet key={res} Id={res} />;
                  })}
                </div>
              ) : (
                ""
              )}

              {posts.tweetedBy._id === userDetails.userid ? (
                <div className="del-btn">
                  <i
                    onClick={(e) => deletePost(posts._id)}
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
                    src={`http://localhost:5000/uploads/${posts.tweetedBy.profilePicture}`}
                  />
                </div>
              </div>
              <div className="col-10 tweet-card-col">
                <div style={{ marginBottom: "13px" }}>
                  <Link to={`/profile/${posts.tweetedBy._id}`}>
                    @{posts.tweetedBy.username}
                  </Link>{" "}
                  - {moment(posts.createdAt).fromNow()}
                </div>
                <div
                  onClick={(e) => navigateTweet(posts._id)}
                  className="tweete-detail"
                >
                  <p>{posts.content}</p>
                  <div className="tweet-image">
                    <img
                      alt=""
                      src={`http://localhost:5000/uploads/${posts.image}`}
                    />
                  </div>
                </div>
                <span>{posts.likes.length}</span>
                {posts.likes.includes(
                  JSON.parse(localStorage.getItem("user")).userid
                ) ? (
                  <i
                    onClick={(e) => disLikePost(posts._id)}
                    className="fa-solid fa-heart liked-tweet"
                    style={{ color: "#f51414" }}
                  ></i>
                ) : (
                  <i
                    onClick={(e) => likePost(posts._id)}
                    className="fa-regular fa-heart like-tweet"
                  ></i>
                )}
                <span>{posts?.replies?.length}</span>
                <i
                  onClick={(e) => giveTweetId(posts._id)}
                  className="fa-regular fa-comment comment-tweet"
                  data-bs-toggle="modal"
                  data-bs-target="#replyModal"
                ></i>
                <span>{posts.reTweetedBy.length}</span>
                <i
                  onClick={(e) => handleRetweet(posts._id)}
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

export default Home;
