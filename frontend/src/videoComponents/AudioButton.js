import { useDispatch, useSelector } from "react-redux";
import pair from "../redux-elements/pair";
import { updateCallStatus } from "../redux-elements/callStatus";
import { useEffect, useState } from "react";
import CaretDropdown from "./CaretDropdown";
import getDevices from "./getDevices";
import { CircularProgress } from "@mui/material";

const AudioButton = ({smallFeedEl}) => {
    const dispatch = useDispatch();
    const callStatus = useSelector(state => state.callStatus);

    const [caretOpen, setCaretOpen] = useState(false);

    const [audioDeviceList, setAudioDeviceList] = useState([]);

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

    // get the list of available audio devices.
    useEffect(() => {
        const getDevicesAsync = async () => {
            if (caretOpen) {
                const devices = await getDevices();
                setAudioDeviceList(devices.audioOutputDevices.concat(devices.audioInputDevices));
            }
        }
        getDevicesAsync();
    }, [caretOpen]);

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
    
    const changeAudioDevice = async (e) => {
        // user changed desired output audio device OR input audio device.
        const deviceId = e.target.value.slice(5);
        const audioType = e.target.value.slice(0, 5);

        if (audioType === "ouput") {
            smallFeedEl.current.setSinkId(deviceId);
        } else if (audioType === "input") {
            const newConstraints = {
                audio: { deviceId: { exact: deviceId } },
                video: callStatus.videoDevice === "default" ? true : {deviceId: {exact: callStatus.videoDevice}}
            }

            const stream = await navigator.mediaDevices.getUserMedia(newConstraints);

            // update redux with device.
            dispatch(updateCallStatus(pair('audioDevice', deviceId)));
            dispatch(updateCallStatus(pair('audio', 'enabled')));

            dispatch(updateCallStatus(pair('localStream', stream)));

            const [audioTrack] = stream.getAudioTracks();

            const senders = callStatus.peerConnection.getSenders();
            const sender = senders.find(s => {
                if (s.track) {
                    return s.track.kind === audioTrack.kind;
                }
                return false;
            })
            sender.replaceTrack(audioTrack);
        }
    }
    return (
        <div className="button-wrapper no-border-right" onClick={toggleAudio}>
            <i className="fa fa-caret-down change-audio" onClick={(e) => {
                e.stopPropagation();
                setCaretOpen(!caretOpen)
            }
            }
   
            ></i>
            {callStatus.socket !== null && callStatus.localStream != null  ?  <i className={ `fa fa-microphone${callStatus.audio === 'off'|| callStatus.audio === 'disabled' ? '-slash': ""}`}></i>: <CircularProgress/>}  
            <div className="btn-text">{micText}</div>
            {caretOpen ? <CaretDropdown
            defaultValue={callStatus.audioDevice}
            changeHandler={changeAudioDevice}
            deviceList={audioDeviceList}
            type="audio"
            /> : <></>
                }
        </div>
        
        )
}
export default AudioButton;