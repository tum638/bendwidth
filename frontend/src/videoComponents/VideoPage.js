// 
import './videoPage.css'
import { addAnswer, updateCallStatus } from '../redux-elements/callStatus'
import {useDispatch, useSelector} from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import createPeerConnection from './webRTCUtilities/createPeerConnection'
import ActionButtons from './ActionButtons'
import pair from '../redux-elements/pair'

import socketConnection from './connectionEstablishment/socketConnection'
import serverListeners from './connectionEstablishment/serverListeners'
import translate from '../translationComponents/translate'
import { updateUserDetails, updateWholeUserObject } from '../redux-elements/userDetails'

// entry point to video chat component.
const VideoPage = () => {
    // initial setup of state.
    const dispatch = useDispatch();

    // references to the video tags.
    const smallFeedEl = useRef(null);
    const largeFeedEl = useRef(null);


    // login status of user.
    const isLoggedIn = JSON.parse(sessionStorage.getItem('userData'))["isLoggedIn"]



    // current status of call.
    const callStatus = useSelector(state => state.callStatus)

    // current user details.
    // const userDetails = useSelector(state => state.userDetails);
    const userDetails = JSON.parse(sessionStorage.getItem('userData'))
    const user = useSelector(state=> state.userDetails);
    const [translatedText, setTranslatedText] = useState('')

    useEffect(() => {
        dispatch(updateWholeUserObject(userDetails)); 
    }, [])

    // check if the respondent has connected.
    useEffect(()=> {
        const checkRespondentConnected = async () => {
            const uuid = userDetails.uuid;
            const {res, translatingFrom} = await callStatus.socket.emitWithAck("isRespondentConnected", uuid)
            if (res === true) {
                userDetails.sourceLanguage = translatingFrom;
                sessionStorage.setItem('userData', JSON.stringify(userDetails));
                dispatch(updateUserDetails(pair("sourceLanguage", translatingFrom)))
                dispatch(updateCallStatus(pair("respondentConnected", true)));
                console.log("getting respondents language", translatingFrom)
               
            }
        }
        if (callStatus.socket && userDetails.isRespondent === false) {
            checkRespondentConnected();
        }
    }, [callStatus.socket])
    
    // get user's camera and microphone
    useEffect(() => {
        const fetchMedia = async () => {
            // what inputs do we want to get from user.
            const constraints = {
                video: true,
                audio: true
            }

            // attempt to get a stream.
            try {
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                // let redux know that we now have media.
                dispatch(updateCallStatus(pair('hasMedia', true)));

                // update redux state with localStream.
                dispatch(updateCallStatus(pair('localStream', stream)));

                // establish a peer connection.
                const { peerConnection, remoteStream } = await createPeerConnection(sendICECandidatesToServer);



                // add event listener to peer to detect if other peer leaves call
                peerConnection.oniceconnectionstatechange = () => {
                    if (peerConnection.iceConnectionState === 'closed') {
                        if (callStatus.status !== "localEnded") {
                            dispatch(updateCallStatus(pair('status', 'remoteEnded')));
                        }   
                    }
                }
                dispatch(updateCallStatus(pair('peerConnection', peerConnection)));
                dispatch(updateCallStatus(pair('remoteStream', remoteStream)));
                

                largeFeedEl.current.srcObject = remoteStream;

                

            } catch (e) {
                console.log(e);
            }
        }
        console.log(isLoggedIn, callStatus.hasMedia, callStatus.socket)
        // attempt to get user media only if user is logged in.
        if (isLoggedIn && !callStatus.hasMedia && callStatus.socket) {  
            fetchMedia();
        }

    }, [callStatus.hasMedia, callStatus.socket])

    useEffect(() => {
        const createAsyncOffer = async () => {
            try {
                const pc = callStatus.peerConnection;
            
            // create the offer.
            const offer = await pc.createOffer();
            pc.setLocalDescription(offer);
            const uuid = userDetails.uuid;
                
                // send the new offer to the server.

            const socket = callStatus.socket;
       
            socket.emit('newOffer', { offer, uuid });
            } catch (error) {
                console.log(error);
            }
        }
        if (callStatus.audio === 'enabled' && callStatus.video === 'enabled' && !callStatus.hasCreatedOffer && userDetails.isRespondent === false && callStatus.respondentConnected) {
            console.log("just sent offer.")
            createAsyncOffer();
        }
        

    }, [callStatus.video, callStatus.audio, callStatus.hasCreatedOffer, callStatus.respondentConnected])
    
    // start listenining to server events.
    useEffect(() => {
        if (callStatus.socket) {
            serverListeners(callStatus.socket,userDetails.isRespondent, dispatch);       
        }
      
    }, [callStatus.socket])

    useEffect(()=> {
        if (user.sourceLanguage && callStatus.socket && callStatus.remoteStream) {
            // send remoteStream to translation api.
            translate(callStatus.remoteStream, userDetails.sourceLanguage, userDetails.hearingIn, setTranslatedText, stopTranslation);
        }
    }, [user.sourceLanguage, callStatus.socket, callStatus.remoteStream])

    // listen for a remoteStream and socket.
    // useEffect(() => {
    //     if (callStatus.socket && callStatus.remoteStream) {
    //         translate(callStatus.remoteStream)
    //     }  
    // }, [callStatus.socket, callStatus.remoteStream])

    const stopTranslation = () => {
        return callStatus.status === "localEnded" || callStatus.status === "remoteEnded";
    }

    // set redux state with offer from inquirer.
    // set remoteDescription.
    useEffect(() => {
        
        const setOffer = async () => {
            const pc = callStatus.peerConnection;
            await pc.setRemoteDescription(callStatus.offer["offer"]);
        }
        if (userDetails.isRespondent === true && callStatus.offer && callStatus.peerConnection) {
            setOffer()
        }
        
    }, [callStatus.offer, callStatus.peerConnection])

    // create an answer.
    useEffect(() => {
        const createAsyncAnswer = async () => {
            const pc = callStatus.peerConnection;
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            dispatch(updateCallStatus(pair('hasCreatedAnswer', true)));
            dispatch(addAnswer({ answer: answer }));
            dispatch(updateCallStatus(pair('answer', answer)));

            const uuid = userDetails.uuid
            const socket = callStatus.socket;

            socket.emit('newAnswer', { answer, uuid });
            // send answer to server

        }
        if (callStatus.offer && callStatus.audio === "enabled" && callStatus.video === "enabled" && !callStatus.hasCreatedAnswer && userDetails.isRespondent === true) {
            createAsyncAnswer();
        }
    }, [callStatus.audio, callStatus.video, callStatus.hasCreatedAnswer, callStatus.offer])
    
    // add answer received from respondent
    useEffect(() => {

        // add received answer to local remoteDescription.
        const addReceivedAnswer = async () => {
            const pc = callStatus.peerConnection;
            await pc.setRemoteDescription(callStatus.answer);
        }
        if (userDetails.isRespondent === false && callStatus.hasCreatedAnswer) {
            addReceivedAnswer();
        }
    }, [callStatus.hasCreatedAnswer])
    

   

    // send ICE candidates to server paying attention to who they belong to.
    const sendICECandidatesToServer = (iceCandidate) => {
        const socket = callStatus.socket;
        const uuid = userDetails.uuid;

        // send ICE candidate to the right person depending on whether they are the inquirer or respondent.
        if (userDetails.isRespondent === true) {
            socket.emit("iceFromRespondentToInquirer", { iceCandidate, uuid });
        } else if (userDetails.isRespondent === false) {
            socket.emit("iceFromInquirerToRespondent", { iceCandidate, uuid });
        }
    }

    
    // after peer connection has been established, request
    // for appropriate ice candidates from backend.
    useEffect(() => {
        const requestForIce = async () => {
            console.log("already requesting for ice")
            const socket = callStatus.socket;
            const uuid = userDetails.uuid;
            const pc = callStatus.peerConnection;
        if (userDetails.isRespondent === true) {
            const inquirerIceCandidates = await socket.emitWithAck("requestForInquirerIce", uuid);
            for (let i = 0; i < inquirerIceCandidates.length; i++) {
                pc.addIceCandidate(inquirerIceCandidates[i]);
            }
        } else if (userDetails.isRespondent === false) {
            const respondentIceCandidates = await socket.emitWithAck("requestForRespondentIce", uuid);
            for (let i = 0; i < respondentIceCandidates.length; i++) {
                pc.addIceCandidate(respondentIceCandidates[i])
            }
        }
        }
        if (callStatus.peerConnection && callStatus.socket && callStatus.hasCreatedAnswer) {
            requestForIce();
        }
        
    }, [callStatus.peerConnection, callStatus.socket, callStatus.hasCreatedAnswer])
    
    // establish connection with the servers.
    useEffect(() => {
        const establishConnection = async () => {
            const { socket, userInfo } = await socketConnection(JSON.parse(sessionStorage.getItem('userData')));
            console.log("established connection and set socket to server")
            dispatch(updateCallStatus(pair('socket', socket)));
        }  
        if (!callStatus.socket) {
            establishConnection();
        }
    }, [])

    return (
        <div>
            <div className="container-fluid">
                <ActionButtons largeFeedEl={largeFeedEl} smallFeedEl={smallFeedEl} />
                <div className="container-fluid video-chat-wrapper">
                    {callStatus.status !== "ongoing" ? <div className='info-box call-ended'>{callStatus.status === "localEnded" ? "You": "John Doe"} ended the call.</div> : <></>}
                    <video id="large-feed" autoPlay controls ref={largeFeedEl}></video>
                    <video id="small-feed" autoPlay controls ref={smallFeedEl} muted ></video>
                    <div className='info-box captions-box'>{translatedText}</div>
                </div>
            
            </div>
        </div>
    )
}
export default VideoPage;