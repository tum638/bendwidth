import { useDispatch, useSelector } from "react-redux";
import { updateCallStatus } from "../redux-elements/callStatus";
import pair from "../redux-elements/pair";

const ShareScreenButton = () => {
    const callStatus = useSelector(state => state.callStatus);
    const dispatch = useDispatch();

    const toggleShareScreen = async () => {
        let mediaStream;
        if (!callStatus.sharingScreen) {
            const options = { video: true, audio: false, surfaceSwitching: 'include', cursor: true };
            try {
                mediaStream = await navigator.mediaDevices.getDisplayMedia(options);
                setNewVideoStream(mediaStream);
                dispatch(updateCallStatus(pair('sharingScreen', true)));
            } catch (error) {
                console.log(error);
            }
        } else {
            const options = { video: true, audio: true };
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia(options);
                setNewVideoStream(mediaStream);
                dispatch(updateCallStatus(pair('sharingScreen', false)));
            } catch (error) {
                console.log(error);
            }    
        }
    }

    // replace the current tracks with required tracks.
    const setNewVideoStream = (mediaStream) => {
        dispatch(updateCallStatus(pair('localStream', mediaStream)));
        const [videoTrack] = mediaStream.getVideoTracks();
        const senders = callStatus.peerConnection.getSenders();
        const sender = senders.find(s => {
            if (s.track) {
                return s.track.kind === videoTrack.kind;
            } else {
                return false;
            }
        });
        sender.replaceTrack(videoTrack);
    }
    return (<div className='button-wrapper middle' onClick={toggleShareScreen}>
        <i className={`fa fa-desktop`}></i>
        <div className="btn-text">{callStatus.sharingScreen ? "Stop Sharing" : "Share Screen"}</div>
            </div>)
}

export default ShareScreenButton;