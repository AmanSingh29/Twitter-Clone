import React, { useEffect, useState } from "react";
import "./home.css";
import Slider from "./Slider";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";

const TweetDetails = () => {
  const { tweetId } = useParams();
  const navigate = useNavigate();

  const userDetails = JSON.parse(localStorage.getItem("user"));

  //usestate define
  const [fetchTweet, setFetchTweet] = useState([]);
  const [tweetLike, setTweetLike] = useState([]);
  const [tweetRetweet, setTweetRetweet] = useState([]);
  const [tweetUser, setTweetUser] = useState({});
  const [tweetReply, setTweetReply] = useState([]);
  const [reply, setReply] = useState([]);
  const [tweetReplyId, setTweetReplyId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const CONFIG = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("jwt"),
  };

  //to fetch a single tweet details
  const fetchTweetDetails = () => {
    setLoading(true);
    fetch(`http://localhost:5000/api/tweet/${tweetId}`, {
      method: "GET",
      headers: CONFIG,
    })
      .then((res) => res.json())
      .then((data) => {
        setFetchTweet(data.result);
        setTweetUser(data.result.tweetedBy);
        setTweetLike(data.result.likes);
        setTweetRetweet(data.result.reTweetedBy);
        setTweetReply(data.result.replies);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchTweetDetails();
  }, [tweetId]);

  //to like the tweet
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
          fetchTweetDetails();
        }
      })
      .catch((error) => console.log(error));
  };

  //to dislike the tweet
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
          fetchTweetDetails();
        }
      })
      .catch((error) => console.log(error));
  };

  const giveTweetId = (postId) => {
    setTweetReplyId(postId);
  };

  // reply a tweet
  const handleReply = () => {
    fetch(`http://localhost:5000/api/tweet/${tweetReplyId}/reply`, {
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
          fetchTweetDetails();
        }
      })
      .catch((error) => console.log(error));
  };

  const navigateTweet = (postId) => {
    navigate(`/tweet/${postId}`);
  };

  //to delete tweet
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
          fetchTweetDetails();
        }
      });
  };

  const fetchUserDetails = (Id) => {
    fetch(`http://localhost:5000/api/user/${Id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setName(data);
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className="row profile-row">
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
      {loading ? (
        <div className="col-8 home-tweet-col">
          <div className="spin">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="col-8 home-tweet-col">
          <div className="tweet-btn-row">
            <b>Home</b>
          </div>
          <div className="row tweet-card">
            <div className="col-1" style={{ marginRight: "17px" }}>
              <div className="home-profile-pic">
                <img
                  className="home-profile-pic"
                  src={`http://localhost:5000/uploads/${tweetUser.profilePicture}`}
                />
              </div>
            </div>
            <div className="col-10 tweet-card-col">
              <div style={{ marginBottom: "13px" }}>
                <b>@{tweetUser.username}</b> -{" "}
                {moment(fetchTweet.createdAt).fromNow()}
              </div>
              <div className="tweete-detail">
                <p>{fetchTweet.content}</p>
                <div className="tweet-image">
                  <img
                    alt=""
                    src={`http://localhost:5000/uploads/${fetchTweet.image}`}
                  />
                </div>
              </div>
              <span>{tweetLike.length}</span>
              {tweetLike.includes(
                JSON.parse(localStorage.getItem("user")).userid
              ) ? (
                <i
                  onClick={(e) => disLikePost(fetchTweet._id)}
                  className="fa-solid fa-heart liked-tweet"
                  style={{ color: "#f51414" }}
                ></i>
              ) : (
                <i
                  onClick={(e) => likePost(fetchTweet._id)}
                  className="fa-regular fa-heart like-tweet"
                ></i>
              )}
              <span>{fetchTweet?.replies?.length}</span>
              <i
                onClick={() => giveTweetId(fetchTweet._id)}
                className="fa-regular fa-comment comment-tweet"
                data-bs-toggle="modal"
                data-bs-target="#replyModal"
              ></i>
              <span>{tweetRetweet.length}</span>
              <i className="fa-solid fa-retweet retweet-tweet"></i>
            </div>
          </div>
          {tweetReply.map((r) => {
            return (
              <div key={r._id} className="row tweet-card">
                {r.tweetedBy === userDetails.userid ? (
                  <div className="del-btn">
                    <i
                      onClick={(e) => deletePost(r._id)}
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
                      src={`http://localhost:5000/uploads/${name.profilePicture}`}
                    />
                  </div>
                </div>
                <div className="col-10 tweet-card-col">
                  <div style={{ marginBottom: "13px" }}>
                    <b>
                      @{fetchUserDetails(r.tweetedBy)}
                      {name.username}
                    </b>{" "}
                    - {moment(r.createdAt).fromNow()}
                  </div>
                  <div
                    onClick={(e) => navigateTweet(r._id)}
                    className="tweete-detail"
                  >
                    <p>{r.content}</p>
                    <div className="tweet-image">
                      <img alt="" src={r.image} />
                    </div>
                  </div>
                  <span>{r?.likes?.length}</span>
                  {r?.likes?.includes(
                    JSON.parse(localStorage.getItem("user")).userid
                  ) ? (
                    <i
                      onClick={(e) => disLikePost(r._id)}
                      className="fa-solid fa-heart liked-tweet"
                      style={{ color: "#f51414" }}
                    ></i>
                  ) : (
                    <i
                      onClick={(e) => likePost(r._id)}
                      className="fa-regular fa-heart like-tweet"
                    ></i>
                  )}
                  <span>{r?.replies?.length}</span>
                  <i
                    onClick={() => giveTweetId(r._id)}
                    className="fa-regular fa-comment comment-tweet"
                    data-bs-toggle="modal"
                    data-bs-target="#replyModal"
                  ></i>
                  <span>{r?.reTweetedBy?.length}</span>
                  <i className="fa-solid fa-retweet retweet-tweet"></i>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TweetDetails;
