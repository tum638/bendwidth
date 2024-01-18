import { addAnswer, updateCallStatus } from "../../redux-elements/callStatus";
import pair from "../../redux-elements/pair";

const serverListeners = (socket, dispatch) => {

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

    





}

export default serverListeners;