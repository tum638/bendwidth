import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import SignupOverlay from "../login/SignupOverlay";
import ErrorIcon from "../login/ErrorIcon";
import { CircularProgress } from "@mui/material";
import { updateUserDetails, updateWholeUserObject } from "../../redux-elements/userDetails";
import pair from "../../redux-elements/pair";
import {v4 as uuidv4 } from 'uuid'
import { useNavigate } from "react-router-dom";

const FindFriends = () => {
  const dispatch = useDispatch();
  const [classYear, setClassYear] = useState("");
  const [gender, setGender] = useState("");
  const [major, setMajor] = useState("");
  const [course, setCourse] = useState("");
  const [matchSimilarInterests, setMatchSimilarInterests] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const userDetails = JSON.parse(sessionStorage.getItem('userData'));
  const navigateTo = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    switch (name) {
      case "classYear":
        setClassYear(value);
        break;
      case "gender":
        setGender(value);
        break;
      case "major":
        setMajor(value);
        break;
      case "course":
        setCourse(value);
        break;
      case "matchSimilarInterests":
        setMatchSimilarInterests(checked);
        break;
      default:
        break;
    }
  };

  const submitInterests = async () => {
    setLoading(true);
    const uuid = uuidv4();
    userDetails.uuid = uuid;
    userDetails.isRespondent = false;
    userDetails.isInquirer = true;
    sessionStorage.setItem('userData', JSON.stringify(userDetails));
    dispatch(updateWholeUserObject(userDetails));
    try {
      const response = await axios.post(
        "https://api.drf.bendwidth.com/study-partners/",
        {
          userId: userDetails.userId, // Assuming userDetails contains the user ID
          classYear,
          gender,
          major,
          course,
          matchSimilarInterests,
          uuid
        }
      );
      console.log(response);
      setLoading(false);
      navigateTo("/main/lobby/")
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError(true);
      setErrMsg(
        error.response ? error.response.data.error : "An error occurred"
      );
      await sleep(2500);
      setError(false);
    }
  };

  return (
    <>
      {loading && (
        <SignupOverlay
          Icon={CircularProgress}
          title="Finding a match. Please wait."
        />
      )}
      {error && <SignupOverlay Icon={ErrorIcon} title={errMsg} />}
      <div className="friends-wrapper">
        <div className="friend-title">
          <h1>Enter your preferences to be matched with a study partner.</h1>
        </div>
        <div className="preferences">
          <div className="preferences-classyear pref">
            <select
              name="classYear"
              className="form-select year"
              aria-label="Default select example"
              value={classYear}
              onChange={handleChange}
            >
              <option value="" disabled>Class year of match</option>
              <option value="any">Im fine with any class year.</option>
              <option value="freshman">Freshman</option>
              <option value="sophomore">Sophomore</option>
              <option value="junior">Junior</option>
              <option value="senior">Senior</option>
            </select>
          </div>
          <div className="preferences-gender pref">
            <select
              name="gender"
              className="form-select gender"
              aria-label="Default select example"
              value={gender}
              onChange={handleChange}
            >
              <option value="">Gender of match</option>
              <option value="any">Im fine with any gender.</option>
              <option value="male">Other</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="preferences-major pref">
            <input
              name="major"
              className="preferences-major-input"
              type="text"
              placeholder="Major of match."
              value={major}
              onChange={handleChange}
            />
          </div>
          <div className="preferences-course pref">
            <input
              name="course"
              className="preferences-course-input"
              type="text"
              placeholder="The course you are taking."
              value={course}
              onChange={handleChange}
            />
          </div>
          <div className="preferences-interests pref">
            <input
              name="matchSimilarInterests"
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault"
              checked={matchSimilarInterests}
              onChange={handleChange}
            />
            <label
              className="form-check-label"
              htmlFor="flexSwitchCheckDefault"
            >
              Match you with someone of similar interests.
            </label>
          </div>

          <div className="find-match" onClick={submitInterests}>
            Find Match
          </div>
        </div>
      </div>
    </>
  );
};

export default FindFriends;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
