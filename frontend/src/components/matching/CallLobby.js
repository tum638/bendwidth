import { useEffect } from "react";
import { useDispatch} from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import jwtDecode from 'jwt-decode'
import { updateWholeUserObject } from "../../redux-elements/userDetails";

const CallLobby = () => {
    const dispatch = useDispatch();
    const navigateTo = useNavigate();
    

    // redirect user to call
    const joinCall = () => {
        navigateTo("/join-video")
    }

    return (
        <div className="lobby-wrapper">
            <div className="lobby-title">
                <i className="fa fa-headset"></i>
                <h1>Your call starts in 10 minutes.</h1>
            </div>
            <div className="lobby-connnected">
                <h4>Nicole is in this call</h4>
            </div>
            <div className="lobby-join" onClick={joinCall}>Join Call</div>

        </div>
    )
}
export default CallLobby