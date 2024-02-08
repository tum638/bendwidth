import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const VideoCards = () => {
  const navigate = useNavigate();
  const userDetails = useSelector((state) => state.userDetails);
  return (
    <div className="schedule__study">
      <div className="schedule__study_top">
        <h1 className="schedule__study__heading">
          Start or schedule a tutoring or study session.
        </h1>
        <p className="schedule_video_text">
          Embark on a journey of collaborative learning and personal growth with
          our versatile study platform. Whether you're seeking one-on-one
          guidance from expert tutors, looking to connect with like-minded
          peers, or eager to participate in dynamic group study sessions, our
          tailored options are designed to enhance your learning experience.
          Dive into a session that suits your style and schedule, and take the
          first step towards achieving your educational goals. Group calls are
          on the horizon, so stay tuned for even more ways to learn and succeed
          together!
        </p>
      </div>

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
    </div>
  );
};

export default VideoCards;

export const VideoCard = ({ title, desc, img, active, link }) => {
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
