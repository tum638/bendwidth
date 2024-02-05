import { useEffect } from "react";
import socketConnection from "../../videoComponents/connectionEstablishment/socketConnection";
import { useDispatch, useSelector } from "react-redux";
import { updateCallStatus } from "../../redux-elements/callStatus";
import pair from "../../redux-elements/pair";

const CallLobby = () => {
    
    return (
        <div className="lobby-wrapper">
            <div className="lobby-title">
                <i className="fa fa-headset"></i>
                <h1>Your call starts in 10 minutes.</h1>
            </div>
            <div className="lobby-connnected">
                <h4>Nicole is in this call</h4>
            </div>
            <div className="lobby-join">Join Call</div>

        </div>
    )
}
export default CallLobby