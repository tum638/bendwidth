import React, { useEffect, useState, useRef } from 'react';

export default function AiAvatars() {
    const VideoRef = useRef(null);
    const AudioRef = useRef(null);

const sdk = require("microsoft-cognitiveservices-speech-sdk");

const SPEECHKEY = '97c2bd24bf414db99caaaa3655eb0c09';
const SPEECHREGION = 'eastus';

const speechConfig = sdk.SpeechConfig.fromSubscription(SPEECHKEY, SPEECHREGION);
// Set either the `SpeechSynthesisVoiceName` or `SpeechSynthesisLanguage`.
speechConfig.speechSynthesisLanguage = "en-US";
speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";

const avatarConfig = new sdk.AvatarConfig(
    "lisa", // Set avatar character here.
    "casual-sitting", // Set avatar style here.
);


//Setting up connection with real-time avatar

const { CommunicationIdentityClient } = require("@azure/communication-identity");
const { CommunicationRelayClient } = require("@azure/communication-network-traversal");

const CONNECTION_STRING = 'endpoint=https://real-time-avatar-communication-resource.unitedstates.communication.azure.com/;accesskey=vyPwiXQU5uQuPDOsZcYtHslRS1DXIiFQ8ooOtgTQy6cvBiKjM6J9WHPRWAkUCBXG7/VIPBtc4ap/iENgKHjjEQ==';


const main = async () => {
    console.log("Azure Communication Services - Relay Token Quickstart")

    // Instantiate the identity client
    const identityClient = new CommunicationIdentityClient(CONNECTION_STRING);
    let identityResponse = await identityClient.createUser();
    console.log(`\nCreated an identity with ID: ${identityResponse.communicationUserId}`);

    const relayClient = new CommunicationRelayClient(CONNECTION_STRING);
    console.log("Getting relay configuration");

    const config = await relayClient.getRelayConfiguration(identityResponse);
    console.log("RelayConfig", config);


    var configuration = { iceServers: config.iceServers };
    var peerConnection = new RTCPeerConnection(configuration);
    // Create WebRTC peer connection
    peerConnection = new RTCPeerConnection({
       iceServers: configuration.iceServers
    })
    
    // Fetch WebRTC video/audio streams and mount them to HTML video/audio player elements
    peerConnection.ontrack = function (event) {
        if (event.track.kind === 'video') {
            VideoRef.current.srcObject = event.streams[0];
            VideoRef.current.autoPlay = true;
        }
        if (event.track.kind === 'audio') {
            AudioRef.current.srcObject =  event.streams[0];
            AudioRef.current.autoplay = true;

        }
    }
    
    // Offer to receive one video track, and one audio track
    peerConnection.addTransceiver('video', { direction: 'sendrecv' })
    peerConnection.addTransceiver('audio', { direction: 'sendrecv' })
    
    // Create avatar synthesizer
    var avatarSynthesizer = new sdk.AvatarSynthesizer(speechConfig, avatarConfig)

    // Start avatar and establish WebRTC connection
    avatarSynthesizer.startAvatarAsync(peerConnection).then(
        (r) => { console.log("Avatar started.")}
    ).catch(
        (error) => { console.log("Avatar failed to start. Error: " + error) }
    );

    avatarSynthesizer.speakTextAsync("Effective communication, attention to detail, and flexibility are key throughout both the planning and execution phases of the hackathon to ensure a successful and memorable event for your ColorStack club members.");
    
};

    main()

    
        return (<div>
        <h1>AI Avatar</h1>
        <div id="videoContainer" style={{backgroundColor:"green"}}>  
            <video ref={VideoRef} controls></video>
            <audio ref={AudioRef} autoPlay></audio>
        </div>
    </div>
    )
}


