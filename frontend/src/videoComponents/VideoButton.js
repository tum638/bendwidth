import { useDispatch, useSelector } from "react-redux";
import { updateCallStatus } from "../redux-elements/callStatus";
import pair from "../redux-elements/pair";
import { useEffect, useState } from "react";
import CaretDropdown from "./CaretDropdown";
import getDevices from "./getDevices";

const VideoButton = ({smallFeedEl}) => {
    const dispatch = useDispatch();
    const callStatus = useSelector(state => state.callStatus);

    // keeps track of wether the user media is still pending.
    const [mediaStillPending, setMediaStillPending] = useState(false);

    const [caretOpen, setCaretOpen] = useState(false);

    const [videoDeviceList, setVideoDeviceList] = useState([]);

    const changeVideoDevice = async (e) => {
        const deviceId = e.target.value;
        const newConstraints = {
            audio: callStatus.audioDevice === "default" ? true : { exact: callStatus.audioDevice},
            video: {deviceId: {exact : deviceId}},
        }
        const stream = await navigator.mediaDevices.getUserMedia(newConstraints);

        dispatch(updateCallStatus(pair('videoDevice', deviceId)));
        smallFeedEl.current.srcObject = stream;
        dispatch(updateCallStatus(pair('localStream', stream)));
        dispatch(updateCallStatus(pair('video', 'enabled')))
        const [videoTrracks] = stream.getVideoTracks()
    }
    
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

    // get all the users video devices.
    useEffect(() => {
        const getDevicesAsync = async () => {
             if (caretOpen) {
                 const devices = await getDevices(); 
                 setVideoDeviceList(devices.videoDevices);
            }
        }
        getDevicesAsync();
       
    }, [caretOpen])

    useEffect(() => {
        if (mediaStillPending && callStatus.hasMedia) {
            console.log("media is now available") 
            setMediaStillPending(false);
            toggleVideo();
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mediaStillPending, callStatus.hasMedia])

    return (<div className="button-wrapper no-border-left" onClick={toggleVideo}>
        <i className="fa fa-caret-down choose-video" onClick={(e) => {
            e.stopPropagation();
            setCaretOpen(!caretOpen)
        }
        }></i>
       <i className={`fa fa-video${callStatus.video === 'enabled' ? '': '-slash'}`}></i>
        <div className="btn-text">{callStatus.video === 'enabled' ? "Stop" : "Start"} Video</div>
        {caretOpen ? <CaretDropdown defaultValue={callStatus.videoDevice}
            changeHandler={changeVideoDevice}
            deviceList={videoDeviceList}
            type="video"
        /> : <></>}
            </div>)
}
export default VideoButton;