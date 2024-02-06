import { useState } from "react";
import interests from "../constants";
import axios from "axios";
import { CircularProgress, formControlLabelClasses } from "@mui/material";
import SignupOverlay from "../login/SignupOverlay";
import ErrorIcon from "../login/ErrorIcon";
import { useSelector } from "react-redux";
const ChooseInterests = () => {
    const [selectedInterests, setSelectedInterests] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false)
    const [errMsg, setErrMsg] = useState(null);
    const userDetails = useSelector(state => state.userDetails);
    const getSelectedInterest = (e) => {
        const interest = e.target.getAttribute('value')
        setSelectedInterests(prevInterests => new Set(prevInterests).add(interest));
    }
    const removeInterest = (e) => {
        const interest = e.target.getAttribute('value');
        setSelectedInterests(prevInterests => {
            const newInterests = new Set(prevInterests);
            newInterests.delete(interest)
            return newInterests;
        })
    }
    const submitInterests = async () => {
        setLoading(true)
        try {
            const interests = Array.from(selectedInterests)
            const response = await axios.post('http:/api.drf.bendwidth.com//user-interests/', {
            userId: 1,
            interests
            })
            console.log(response)
            setLoading(false);
        } catch (error) {
        console.log(error)
        setLoading(false);
        setError(true);
        setErrMsg(error.response.data.error);
        await sleep(2500);
        setError(false);
        }
        

    }

    return (
        
        <div className="interests-wrapper">
            { loading && (
            <SignupOverlay  Icon={CircularProgress} title="Loading" />
            )}
            {error && (
                <SignupOverlay Icon={ErrorIcon} title={errMsg} />
            )}
            <div className="interests-wrapper-title">
                <h1>Select your interests and hobbies and we will find the right people for you.</h1>
            </div>
            <div className="user-interests-section">
                <div className="user-interests">
                    <h5>Your top 5 interests </h5>
                    <h8 className="select-interest-subtitle">Click interest to remove it from the list. You can't select more than 5 interests.</h8>
            </div>
            <div className="selected-interests" onClick={removeInterest}>
                {Array.from(selectedInterests).map(interest => <InterestBadge interest={interest} icon={true} />)}
            </div>
            </div>
            
            <div className="available-interests-section">
            <div className="available-interests-title">
                <h5>Select your interests and hobbies from the most common ones here.</h5>
            </div>
            <div className="available-interests" onClick={getSelectedInterest}>
                
                    {interests.map(interest => <InterestBadge interest={interest} icon={false} />)}
            </div>
            </div>
           
            <div className="submit-interests" onClick={submitInterests}>
                Submit interests
            </div>
        </div>
    )
}

const InterestBadge = ({interest, icon}) => {
    return (
        <div value={interest} className="interest-badge">
            {interest}</div>

       
    )
    
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


export default ChooseInterests;