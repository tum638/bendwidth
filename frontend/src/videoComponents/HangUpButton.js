import { useDispatch, useSelector } from "react-redux";
import { updateCallStatus } from "../redux-elements/callStatus";
import pair from "../redux-elements/pair";

const HangUpButton = ({largeFeedEl, smallFeedEl}) => {
    const dispatch = useDispatch();
    const callStatus = useSelector(state => state.callStatus);

    const hangUpCall = () => {
        let pc = callStatus.peerConnection;
        pc.close();
        pc.onicecandidate = null;
        pc.onaddstream = null;
        pc = null;
        dispatch(updateCallStatus(pair('status', 'complete')))
        smallFeedEl.current.srcObject = null;
        largeFeedEl.current.srcObject = null;
    }

    if (callStatus.status === "complete") {
        return <></>
    }

    return (<div className='button-wrapper end' onClick={hangUpCall}>
                <i className="fa fa-phone"></i>
                <div className="btn-text">Hang Up</div>
            </div>)
}

export default HangUpButton;