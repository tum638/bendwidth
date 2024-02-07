import React from "react";
import { VideoCard } from "./VideoCards";

const Interview = () => {
  return (
    <div className="interview">
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
    </div>
  );
};

export default Interview;
