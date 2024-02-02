import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import SignupOverlay from "../login/SignupOverlay";
import ErrorIcon from "../login/ErrorIcon";
import { CircularProgress } from "@mui/material";

const FindFriends = () => {
    const userDetails = useSelector(state => state.userDetails);
    const [classYear, setClassYear] = useState(null);
    const [gender, setGender] = useState(null);
    const [major, setMajor] = useState(null);
    const [course, setCourse] = useState(null);
    const [matchSimilarInterests, setMatchSimilarInterests] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false)
    const [errMsg, setErrMsg] = useState('');


    const handleClick = (e) => {
        console.log(e.target.getAttribute("class"))
        console.log(e.target.value)
        if (e.target.getAttribute("class") === "form-select year") {
            setClassYear(e.target.value);
        }
        else if (e.target.getAttribute("class") === "form-select gender") {
            setGender(e.target.value);
        } else if (e.target.getAttribute("class") === "form-preferences-major-input") {
            setMajor(e.target.value)
        } else if (e.target.getAttribute("class") === "preferences-course-input") {
            setCourse(e.target.value)
        } else if (e.target.getAttribute("class") === "form-check-input") {
            setMatchSimilarInterests(!matchSimilarInterests)
        }
    }
    const submitInterests = async () => {
        setLoading(true)
        try {
            const response = await axios.post("http://localhost:8000/study-partners/", {
            userId: 1, // Come back to this wrong user id.
            classYear,
            gender,
            major,
            course,
            matchSimilarInterests
            })
            console.log(response)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false);
            setError(true);
            // setErrMsg(error.response.data.error);
            await sleep(2500);
            setError(false);
        }
        
    }
    return (
        <>
        {loading && (
            <SignupOverlay Icon={CircularProgress} title="Finding a match. Please wait." />
        )}
        {error && (
            <SignupOverlay Icon={ErrorIcon} title={errMsg} />
        )}
        <div className="friends-wrapper">
        <div className="friend-title">
            <h1>Enter your preferences to be matched with a study partner.</h1>
        </div>
        <div onClick={handleClick} onChange={handleClick} className="preferences">

              

            <div className="preferences-classyear pref">
                <select  className="form-select year" aria-label="Default select example">
                    <option value="" >Class year of match</option>
                <option value="any">Any</option>
                <option value="freshman">Freshman</option>
                <option value="sophomore">Sophomore</option>
                    <option value="junior">Junior</option>
                    <option value="senior">Senior</option>
                    
            </select>
            </div>
            <div className="preferences-gender pref">
                <select  className="form-select gender" aria-label="Default select example">
                    <option value="" >Gender of match</option>
                <option value="any">Any</option>
                <option value="freshman">Male</option>
                <option value="sophomore">Female</option>
                    
            </select>
            </div>
             <div className="preferences-major pref">
             <input name="major-pref" className="preferences-major-input" type="text" placeholder="Major of match." />
            </div>
            <div className="preferences-course pref">
             <input name="course-pref" className="preferences-course-input" type="text" placeholder="The course you are taking." />
            </div>
              <div className="preferences-interests pref">
                <input 
                    selected={matchSimilarInterests}
        className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                    <label className="form-check-label" for="flexSwitchCheckDefault">Match you with someone of similar interests.</label>
            </div>
            
            <div className="find-match" onClick={submitInterests}>
                Find Match
            </div>
            </div>
        </div>
    </>
    
    )
    

}

export default FindFriends;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}