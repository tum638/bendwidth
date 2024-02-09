
import { io } from 'socket.io-client';



let socket;
// function establishes a connection with the backend.
const socketConnection = async (userDetails) => {

    console.log("socket info was called")
    const userInfo = {
            uuid: userDetails.uuid,
            userId: userDetails.userId,
            userName: userDetails.userName,
            userEmail: userDetails.email,
            isInquirer: userDetails.isInquirer,
            isRespondent:userDetails.isRespondent,
            translatingFrom: userDetails.translatingFrom
        }
    console.log(userInfo)

    // return the socket if it is alreay connected.
    if (socket && socket.connected) {
        return { socket, userInfo };
    }
 
    // this is the first time a connection is being established. Sent auth data with connection.
    socket = await io.connect("https://localhost:9000/", {
        auth: {
           userInfo,
        }
    })
    return { socket, userInfo };
}
export default socketConnection;