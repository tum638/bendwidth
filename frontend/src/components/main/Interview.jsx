import React from "react";
import { VideoCard } from "./VideoCards";

const Interview = () => {
  return (
    <div className="interview">
      <div className="schedule__study_top">
        <h1 className="schedule__study__heading">
          Start or schedule a mock interview session.
        </h1>
        <p className="schedule_video_text">
          Fine-tune your interview skills and boost your confidence with our
          interactive practice sessions. Engage in Behavioral Interviews to
          navigate the nuances of personality-driven questions or dive into Peer
          Interviews for a rigorous test of your technical knowledge, including
          live coding challenges. Perfect for those looking to sharpen their
          responses and impress in real-world scenarios. Start a call now and
          transform preparation into success.
        </p>
      </div>
      <div className="interview__flex">
        <VideoCard
          title={"Behavioral Interview"}
          desc={"Practice behavioral interviewing with friends."}
          active={true}
          img={"/interview.png"}
          className="video_margin"
        />
        <VideoCard
          title={"Peer Interview"}
          desc={"Practice mock and coding interviewing with friends."}
          active={true}
          img={"/coding_interview.png"}
        />
        <VideoCard
          title={"Peer Interview"}
          desc={"Practice mock and coding interviewing with friends."}
          active={true}
          img={"/coding_interview.png"}
        />
      </div>
    </div>
  );
};

export default Interview;
