// 
import './videoPage.css'
import { addAnswer, updateCallStatus } from '../redux-elements/callStatus'
import { UseSelector, useDispatch, useSelector} from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import createPeerConnection from './webRTCUtilities/createPeerConnection'
import ActionButtons from './ActionButtons'
import pair from '../redux-elements/pair'
import { useSearchParams } from 'react-router-dom'
import socketConnection from './connectionEstablishment/socketConnection'
import serverListeners from './connectionEstablishment/serverListeners'




// entry point to video chat component.
const VideoPage = () => {
    // initial setup of state.
    const dispatch = useDispatch();

    // references to the video tags.
    const smallFeedEl = useRef(null);
    const largeFeedEl = useRef(null);

    // login status of user.
    const isLoggedIn = useSelector(state => state.userDetails.isLoggedIn);

    // get search parameters
    const [searchParams, setSearchParams] = useSearchParams();

    // current status of call.
    const callStatus = useSelector(state => state.callStatus)

    // current user details.
    const userDetails = useSelector(state => state.userDetails);


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
                dispatch(updateCallStatus(pair('peerConnection', peerConnection)));
                dispatch(updateCallStatus(pair('remoteStream', remoteStream)));
                

                largeFeedEl.current.srcObject = remoteStream;
            } catch (e) {
                console.log(e);
            }
        }

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
        if (callStatus.audio === 'enabled' && callStatus.video === 'enabled' && !callStatus.hasCreatedOffer && searchParams.get("isRespondent") === "false") {
            createAsyncOffer();
        }
        

    }, [callStatus.video, callStatus.audio, callStatus.hasCreatedOffer])
    
    // start listenining to server events.
    useEffect(() => {
        if (callStatus.socket) {
            serverListeners(callStatus.socket,  dispatch);  
        }
      
    }, [callStatus.socket])

    // establish connection with the servers.
    useEffect(() => {
        const establishConnection = async () => {
            const { socket, userInfo } = await socketConnection(searchParams.get('isRespondent'));
            console.log("established connection and set socket to server")
            dispatch(updateCallStatus(pair('socket', socket)));
        }  
        if (!callStatus.socket) {
            establishConnection();
        }
    }, [])

    // set redux state with offer from inquirer.
    // set remoteDescription.
    useEffect(() => {
        
        const setOffer = async () => {
            const pc = callStatus.peerConnection;
            await pc.setRemoteDescription(callStatus.offer["offer"]);
        }
        if (searchParams.get("isRespondent") === "true" && callStatus.offer) {
            setOffer()
        }
        
    }, [callStatus.offer])

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
        if (callStatus.offer && callStatus.audio === "enabled" && callStatus.video === "enabled" && !callStatus.hasCreatedAnswer && searchParams.get("isRespondent") === "true") {
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
        if (searchParams.get("isRespondent") === "false" && callStatus.hasCreatedAnswer) {
            addReceivedAnswer();
        }
    }, [callStatus.hasCreatedAnswer])
    

   

    // send ICE candidates to server paying attention to who they belong to.
    const sendICECandidatesToServer = (iceCandidate) => {
        const socket = callStatus.socket;
        const uuid = userDetails.uuid;

        // send ICE candidate to the right person depending on whether they are the inquirer or respondent.
        if (searchParams.get("isRespondent") === "true") {
            socket.emit("iceFromRespondentToInquirer", { iceCandidate, uuid });
        } else if (searchParams.get("isRespondent") === "false") {
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
        if (searchParams.get("isRespondent") === "true") {
            const inquirerIceCandidates = await socket.emitWithAck("requestForInquirerIce", uuid);
            for (let i = 0; i < inquirerIceCandidates.length; i++) {
                pc.addIceCandidate(inquirerIceCandidates[i]);
            }
        } else if (searchParams.get("isRespondent") === "false") {
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
    
    

    return (
        <div>
            <div className="container-fluid">
                <ActionButtons largeFeedEl={largeFeedEl} smallFeedEl={smallFeedEl} />
                <div className="container-fluid video-chat-wrapper">
                    <video id="large-feed" autoPlay controls playsInline ref={largeFeedEl}></video>
                    <video id="small-feed" autoPlay controls playsInline ref={smallFeedEl} muted ></video>
                </div>
            
            </div>
        </div>
    )
}
export default VideoPage;