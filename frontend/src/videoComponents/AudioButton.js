import { useDispatch, useSelector } from "react-redux";
import pair from "../redux-elements/pair";
import { updateCallStatus } from "../redux-elements/callStatus";

const AudioButton = () => {
    const dispatch = useDispatch();
    const callStatus = useSelector(state => state.callStatus);

    // set mic text
    let micText;
    if (callStatus.audio === 'off') {
        micText = "Join Audio"
    } else if (callStatus.audio === 'enabled') {
        micText = "Mute"
    }
    else {
        micText = "Unmute"
    }

    // toggle audio on/off
    const toggleAudio = () => {
        const tracks = callStatus.localStream.getAudioTracks();
        if (callStatus.audio === "enabled") {
            tracks.forEach(t => t.enabled = false);
            dispatch(updateCallStatus(pair('audio', 'disabled')));

        } else if (callStatus.audio === "disabled") {
            tracks.forEach(t => t.enabled = true);
            dispatch(updateCallStatus(pair('audio', 'enabled')));

        } else {
            tracks.forEach(t => {
                callStatus.peerConnection.addTrack(t, callStatus.localStream);
            })
            dispatch(updateCallStatus(pair('audio', 'enabled')));
        }
    }

    return (<div className="button-wrapper no-border-right" onClick={toggleAudio}>
                <i className={`fa fa-microphone${callStatus.audio === 'off'|| callStatus.audio === 'disabled' ? '-slash': ""}`}></i>
        <div className="btn-text">{micText}</div>
            </div>)
}
export default AudioButton;