import axios from "axios";
import { useEffect, useState } from "react";
import SignupOverlay from "../login/SignupOverlay";
import { CircularProgress } from "@mui/material";
import ErrorIcon from "../login/ErrorIcon";
import { useDispatch } from "react-redux";
import { updateUserDetails, updateWholeUserObject } from "../../redux-elements/userDetails";
import pair from "../../redux-elements/pair";
import { v4 as uuidv4 } from 'uuid';
const FindTutor = () => {
  const dispatch = useDispatch();
  const [questionCourse, setQuestionCourse] = useState("null");
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionDetails, setQuestionDetails] = useState("");
  const [attempts, setAttempts] = useState("");
  const [tutorGender, setTutorGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const userDetails = JSON.parse(sessionStorage.getItem('userData'));


  const handleFindTutor = async () => {
    setLoading(true);
    const uuid = uuidv4();
    userDetails.uuid = uuid;
    userDetails.isRespondent = false;
    userDetails.isInquirer = true;
    sessionStorage.setItem('userData', JSON.stringify(userDetails));
    dispatch(updateWholeUserObject(userDetails));
    try {
      const response = await axios.post("http://localhost:8000/find-tutors/", {
        questionCourse,
        questionTitle,
        questionDetails,
        attempts,
        tutorGender,
        uuid
      });

      console.log(response);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError(true);
      setErrMsg(error.response?.data?.error);
      await sleep(2500);
      setError(false);
    }
  };
  const handleChangeInfo = (e) => {
    console.log(e.target.id);
    console.log(e.target.value);
    if (e.target.id === "course") {
      setQuestionCourse(e.target.value);
    } else if (e.target.id === "description") {
      setQuestionTitle(e.target.value);
    } else if (e.target.id === "question-details") {
      setQuestionDetails(e.target.value);
    } else if (e.target.id === "question-attempts") {
      setAttempts(e.target.value);
    } else if (e.target.id === "gender") {
      setTutorGender(e.target.value);
    }
  };

  return (
    <>
      {error && <SignupOverlay Icon={ErrorIcon} title={errMsg} />}
      <div className="tutor-wrapper" onChange={handleChangeInfo}>
        <div className="tutor-title">
          <h1>Ask a question and get matched with a tutor.</h1>
        </div>
        <div className="question-guideline">
          <div className="question-guideline-title">
            <i className="fa fa-circle-info"></i>
            <h4 className="writing-good-question">Writing a good question</h4>
          </div>

          <h6>Steps</h6>
          <ul>
            <li>Summarize your problem in one-line title</li>
            <li>Describe your problem in detail</li>
            <li>Describe what you've tried</li>
            <li>Add preferences for the type of tutor you want.</li>
          </ul>
        </div>
        <div className="question-title question">
          <h5>Question Topic and Description</h5>
          <p className="question-title-remark">
            Be specific and imagine you're asking a question to another person
          </p>
          <div className="question-title-inputs">
            <input
              id="course"
              type="text"
              name="course"
              placeholder="Which course is this question from?"
            />
            <input
              id="description"
              type="text"
              name="description"
              placeholder="e.g Is there an R function for finding the index of an element in a vector?"
            />
          </div>
        </div>
        <div className="question-attempts question">
          <h5>What are the details of your problem?</h5>
          <p className="question-title-remark">
            Introduce your problem and expand on what you put in the title.
          </p>
          <textarea
            id="question-details"
            className="question-details"
            placeholder="e.g. In R, I have an element x and a vector v. I want to find the first index of an element in v that is equal to x. I know that one way to do this is: which(x == v)[[1]], but that seems excessively inefficient. Is there a more direct way to do it?"
          ></textarea>
        </div>
        <div className="question-attempts question">
          <h5>What did you try and what were you expecting?</h5>
          <p className="question-title-remark">Describe what you tried.</p>
          <textarea
            id="question-attempts"
            className="question-details"
          ></textarea>
        </div>
        <div className="tutor-preferences question">
          <h5>Tutor preferences</h5>
          <input id="gender" type="text" placeholder="Preferred gender?" />
        </div>
        <div className="submit-question question" onClick={handleFindTutor}>
          {loading ? <CircularProgress /> : "Find Tutor"}
        </div>
      </div>
    </>
  );
};

export default FindTutor;
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
