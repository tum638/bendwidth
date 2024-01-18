import { useDispatch, useSelector } from "react-redux";
import { updateCallStatus } from "../redux-elements/callStatus";
import pair from "../redux-elements/pair";
import { useEffect, useState } from "react";

const VideoButton = ({smallFeedEl}) => {
    const dispatch = useDispatch();
    const callStatus = useSelector(state => state.callStatus);

    // keeps track of wether the user media is still pending.
    const [mediaStillPending, setMediaStillPending] = useState(false);
    
    // function to start/stop video
    const toggleVideo = () => {
        if (callStatus.video === "enabled") {
            // stop the video.
            const tracks = callStatus.localStream.getVideoTracks();
            tracks.forEach(t => t.enabled = false);

            // update redux state
            dispatch(updateCallStatus(pair('video', 'disabled')));
        } else if (callStatus.video === "disabled") {
            const tracks = callStatus.localStream.getVideoTracks();
            tracks.forEach(t => t.enabled = true);
            dispatch(updateCallStatus(pair('video', 'enabled')));
        } else if (callStatus.hasMedia) {
            smallFeedEl.current.srcObject = callStatus.localStream;

            // add local tracks to the peer connection.
            callStatus.localStream.getVideoTracks().forEach(t => {
                callStatus.peerConnection.addTrack(t, callStatus.localStream);
            })

            // update redux state
            dispatch(updateCallStatus(pair('video', 'enabled')));
        } else {
            // the video is off and we dont have user media yet, wait for user media.
            setMediaStillPending(true)
        }
    }

    useEffect(() => {
        if (mediaStillPending && callStatus.hasMedia) {
            console.log("media is now available") 
            setMediaStillPending(false);
            toggleVideo();
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mediaStillPending, callStatus.hasMedia])

   return ( <div className="button-wrapper no-border-left" onClick={toggleVideo}>
       <i className={`fa fa-video${callStatus.video === 'enabled' ? '': '-slash'}`}></i>
       <div className="btn-text">{callStatus.video === 'enabled' ? "Stop" : "Start"} Video</div>
            </div>)
}
export default VideoButton;