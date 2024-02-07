

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

    // var configuration = { iceServers: iceServers };
    // var peerConnection = new RTCPeerConnection(configuration);
};

main().catch((error) => {
  console.log("Encountered and error");
  console.log(error);
})
