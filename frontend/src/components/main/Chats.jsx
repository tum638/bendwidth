import React from "react";
import { useNavigate } from "react-router-dom";

const Chats = () => {
  const navigate = useNavigate();
  return (
    <div className="chats">
      <div className="chats_empty">
        <h1 className="chats__heading">
          <span className="empty__icon">x</span>
          You do not have any saved chats at the moment
        </h1>
        <p className="chats__desc">
          Enhance your learning experience by saving your chat conversations
          during study and tutoring sessions. This feature allows you to revisit
          important discussions, review key points, and continue to engage with
          your study buddies and tutors even after the session has ended. It's a
          convenient way to retain knowledge, track your progress, and maintain
          valuable connections with your educational network.
        </p>
        <button className="start_video_chart" onClick={() => navigate("/main")}>
          <i className="fa-solid fa-video"></i> Start a call
        </button>
      </div>
    </div>
  );
};

export default Chats;
