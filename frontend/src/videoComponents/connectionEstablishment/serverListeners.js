import { addAnswer, updateCallStatus } from "../../redux-elements/callStatus";
import pair from "../../redux-elements/pair";
import { updateUserDetails } from "../../redux-elements/userDetails";

const serverListeners = (socket, isRespondent, dispatch) => {
    const userDetails = JSON.parse(sessionStorage.getItem('userData'));
    // listener for respondent to get offer.
    socket.on('newOfferAwaiting', ({offerData, translatingFrom}) => {
        // we now have the offer, store the offer.
        userDetails.sourceLanguage = translatingFrom;
        sessionStorage.setItem('userData', JSON.stringify(userDetails));
        dispatch(updateCallStatus(pair('offer', offerData)));
        dispatch(updateUserDetails(pair("sourceLanguage", translatingFrom)));

        console.log("got inquirers language",translatingFrom)
    })

    //listener for inquirer to get answer.
    socket.on('answerToInquirer', ({answer, translatingFrom}) => {
        dispatch(updateCallStatus(pair('answer', answer)));
        dispatch(updateCallStatus(pair('hasCreatedAnswer', true)));    
    }) 

    socket.on("someRespondentConnected", ({uuid, translatingFrom}) => {
        console.log("received respondent connection event")
        if (isRespondent === false && uuid == userDetails.uuid) {
            userDetails.sourceLanguage = translatingFrom;
            sessionStorage.setItem('userData', JSON.stringify('userData'));
            dispatch(updateCallStatus(pair("respondentConnected", true)));
            dispatch(updateUserDetails(pair("sourceLanguage", translatingFrom)))
            console.log("got respondents language", translatingFrom)
            
            
        }
    })
    





}

export default serverListeners;