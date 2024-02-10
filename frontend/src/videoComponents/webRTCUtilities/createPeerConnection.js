import peerConfiguration from "./stunServers";

const createPeerConnection = (sendICECandidatesToServer) => {
    return new Promise(async (resolve, reject) => {
        // connection to the peer.
        const peerConnection = new RTCPeerConnection(peerConfiguration);
        
        // initialize the remtoteStream as an empty MediaStream object.
        const remoteStream = new MediaStream();

        // keep track of the state of our signaling process.
        peerConnection.addEventListener('signalingstatechange', (e) => {
            console.log("Signaling State Change")
            console.log(e)
        })

        //listen for ICE candidates.
        peerConnection.addEventListener('icecandidate', e => {
            console.log('Found ice candidate')
            if (e.candidate) {
                // emit candidate to server if 
                // socket exits, otherwise buffer.
                sendICECandidatesToServer(e.candidate);
            }
        })

        // listen for remote tracks...
        peerConnection.addEventListener('track',e=>{
            console.log("Got a track from the remote!")
            e.streams[0].getTracks().forEach(track=>{
                remoteStream.addTrack(track);
            })
        })


        resolve({
            peerConnection,
            remoteStream
        })
    })
}
export default createPeerConnection;