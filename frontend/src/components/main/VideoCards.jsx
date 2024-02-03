import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const VideoCards = () => {
  const navigate = useNavigate();
  const userDetails = useSelector(state => state.userDetails);
  return (
    <div className="video-cards">
      <VideoCard
        title="Start a tutoring session"
        desc="We will match you with a tutor, to help with your study."
        img={"/student_tutor.png"}
        link={"/main/findtutor"}
        active={true}
      />
      <VideoCard
        title="Student-student call"
        desc="Study with students who closely resemble your preferences."
        img={"/student_student.png"}
        link={"/main/findfriend"}
        active={true}
      />
      <VideoCard
        title={"Group calls"}
        desc="Start a collaborative group call with other students."
        img={"/group_study.png"}
        active={false}
      />
    </div>
  );
};

export default VideoCards;

const VideoCard = ({ title, desc, img, active, link }) => {
  const navigate = useNavigate();
  return (
    <div className="video_card">
      <Card className="video_mui__card">
        <CardContent>
          <h3 className="video_card__title">{title}</h3>
          <p className="video_card__desc">{desc}</p>
          <div className="video_card__img">
            <img src={img} alt="student studying" />
          </div>
          {active ? (
            <button
              className="start_video_chart"
              onClick={() => navigate(link)}
            >
              <i className="fa-solid fa-video"></i> Start call
            </button>
          ) : (
            <p className="disabled__video">Coming soon!!!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
