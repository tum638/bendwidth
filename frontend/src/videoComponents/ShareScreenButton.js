import { useDispatch, useSelector } from "react-redux";
import { updateCallStatus } from "../redux-elements/callStatus";
import pair from "../redux-elements/pair";

const ShareScreenButton = () => {
    const callStatus = useSelector(state => state.callStatus);
    const dispatch = useDispatch();
  
    // replace the current tracks with required tracks.
    const setNewVideoStream = (videoTrack) => {
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
    const startSharing = async () => {
        let mediaStream;
        if (!callStatus.sharingScreen) {
            let options = { video: true, audio: false, surfaceSwitching: 'include', cursor: true };
            try {
                mediaStream = await navigator.mediaDevices.getDisplayMedia(options);
                const [videoTrack] = mediaStream.getVideoTracks();

                // listen to stop of screen share.
                videoTrack.onended = async () => {
                    let options = { video: true, audio: true };
                    try {
                        mediaStream = await navigator.mediaDevices.getUserMedia(options);
                        const [videoTrack] = mediaStream.getVideoTracks();
                        setNewVideoStream(videoTrack);
                        dispatch(updateCallStatus(pair('sharingScreen', false)));
                        dispatch(updateCallStatus(pair('localStream', mediaStream)));
                    } catch (error) {
                        console.log(error);
                    }
                    
                }
                setNewVideoStream(videoTrack);
                dispatch(updateCallStatus(pair('sharingScreen', true)));
                dispatch(updateCallStatus(pair('localStream', mediaStream)));
            } catch (err) {
                console.log(err);
            }
        }
    }
    return (<div className='button-wrapper middle' onClick={startSharing}>
        <i className={`fa fa-desktop`}></i>
        <div className="btn-text">{callStatus.sharingScreen ? "Stop Sharing" : "Share Screen"}</div>
            </div>)
}

export default ShareScreenButton;