
import { io } from 'socket.io-client';



let socket;
// function establishes a connection with the backend.
const socketConnection = async (isRespondent) => {
    let userInfo;
    console.log("socket info was called")
    // decide which user the socket if for.
    if (isRespondent === "false") {
        userInfo = {
            uuid: "12345",
            userId: 1,
            userName: "Tanatswa Manyakara",
            userEmail: "tum1@williams.edu",
            isInquirer: true
        }
    } else {
        userInfo = {
            uuid: "12345",
            userId: 2,
            userName: "Milton Vento",
            userEmail: "mv9@williams.edu",
            isRespondent: true
        }
    }

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