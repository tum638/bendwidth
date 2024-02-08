import { addAnswer, updateCallStatus } from "../../redux-elements/callStatus";
import pair from "../../redux-elements/pair";

const serverListeners = (socket, isRespondent, dispatch) => {
    const userDetails = JSON.parse(sessionStorage.getItem('userData'));
    // listener for respondent to get offer.
    socket.on('newOfferAwaiting', offerData => {
        // we now have the offer, store the offer.
        dispatch(updateCallStatus(pair('offer', offerData)));

    })

    //listener for inquirer to get answer.
    socket.on('answerToInquirer', answer => {
        dispatch(updateCallStatus(pair('answer', answer)));
        dispatch(updateCallStatus(pair('hasCreatedAnswer', true)));
    }) 

    socket.on("someRespondentConnected", uuid=> {
        console.log("received respondent connection event")
        if (isRespondent === false && uuid == userDetails.uuid) {
            dispatch(updateCallStatus(pair("respondentConnected", true)))
        }
    })
    





}

export default serverListeners;