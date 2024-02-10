// all our socketServer stuff happens here.

const io = require('./server').io;

const allConnectedInquirers = {}
const allConnectedRespondents = {}
const allKnownOffers = {}

io.on('connection', socket => {
    console.log(socket.id, "has connected.")
    console.log(socket.handshake.auth.userInfo)

    // check if socket is valid.
    if (!socket.handshake.auth.userInfo) {
        // socket is invalid, disconnect.
        socket.disconnect()
        console.log("could not find a valid auth object")
        return;
    }
    const {uuid, userName, userEmail, isRespondent, isInquirer, translatingFrom } = socket.handshake.auth.userInfo;
     
    // add the user to their category.
    if (isInquirer) {
        console.log("UUID inquirer", uuid)
        console.log(translatingFrom)
        allConnectedInquirers[uuid] = {
            userName, userEmail, isInquirer, socketId: socket.id, translatingFrom
        }
    } else if (isRespondent) {
        console.log("UUID respondent", uuid)
        allConnectedRespondents[uuid] = {
            userName, userEmail, isRespondent, socketId: socket.id, translatingFrom
        }
        console.log("sent respondent connection event")
        if (uuid in allConnectedInquirers) {
            const socketId = allConnectedInquirers[uuid].socketId
            console.log("sending language to inquirer", translatingFrom)
            socket.to(socketId).emit("someRespondentConnected", {uuid, translatingFrom});
        }

    }

    // listen for any new offers.
    socket.on('newOffer', ({ offer, uuid }) => {
        // add the offer to the list of all the known offers.
        allKnownOffers[uuid] = {
            uuid,
            offer,
            offererIceCandidates: [],
            answer: null,
            answerIceCandidates: []
        }

        // filter the respondent from the list of all respondents.
        const respondentToSendTo = allConnectedRespondents[uuid];

        console.log(allConnectedRespondents[uuid])
        // check if the respondent exists.
        if (respondentToSendTo) {
            const socketId = respondentToSendTo.socketId;
            const translatingFrom = allConnectedInquirers[uuid]["translatingFrom"]
            console.log("sending inquirer language to respondent.", translatingFrom)
            socket.to(socketId).emit('newOfferAwaiting', {offerData:allKnownOffers[uuid], translatingFrom: translatingFrom})
        }
        else {
            console.log("The respondent could not be found.")
        }

    })

    // listen for a new answer.
    socket.on('newAnswer', ({ answer, uuid }) => {
        // find the inquirer to send the answer to.
        const inquirerToSendTo = allConnectedInquirers[uuid];
        const translatingFrom = allConnectedRespondents[uuid]["translatingFrom"]
        // check if the inquirer exists.
        if (inquirerToSendTo) {
            const socketId = inquirerToSendTo.socketId;
            console.log("sending language to resp")
            socket.to(socketId).emit('answerToInquirer', {answer, translatingFrom});
        }
        else {
            console.log("The inquirer could not be found.");
        }

        const targetOffer = allKnownOffers[uuid];
        targetOffer["answer"] = answer;

    });

    // listen for ice candidate from respondent
    socket.on("iceFromRespondentToInquirer", ({ iceCandidate, uuid }) => {

        const targetOffer = allKnownOffers[uuid];
        targetOffer.answerIceCandidates.push(iceCandidate);

    })

    // listen for ice candidate from inquirer
    socket.on("iceFromInquirerToRespondent", ({ iceCandidate, uuid }) => { 
        const targetOffer = allKnownOffers[uuid];
        targetOffer.offererIceCandidates.push(iceCandidate);
    })

    // request inquirer ICE.
    socket.on("requestForInquirerIce", (uuid, ackFunc) => {
        const targetOffer = allKnownOffers[uuid];
        let iceCandidates = targetOffer["offererIceCandidates"];
        console.log(iceCandidates, "ice was requested inquirer");
        ackFunc(iceCandidates);
    })

    

    // request  for respondent ICE
    socket.on("requestForRespondentIce", (uuid, ackFunc) => {
        const targetOffer = allKnownOffers[uuid];
        let iceCandidates = targetOffer["answerIceCandidates"];
        console.log(iceCandidates, "ice was requested respondent");
        ackFunc(iceCandidates);
    })

    // check if respondent is here.
    socket.on("isRespondentConnected", (uuid, ackFunc)=> {
        const targetRespondent = allConnectedRespondents[uuid];
        const translatingFrom = targetRespondent?.translatingFrom;
        if (targetRespondent) {
            ackFunc({res:true, translatingFrom: translatingFrom});
        } else {
            ackFunc({res:false, translatingFrom: null});
        }
    })
    
    // listen for translation chunks
    socket.on("translatedChunk", ({uuid, chunk, isRespondent})=> {
        let socketId;
        if (isRespondent===true) {
            socketId = allConnectedInquirers[uuid].socketId;
        } else {
            socketId = allConnectedRespondents[uuid].socketId
        }
        socket.to(socketId).emit("yourTranslatedText", chunk)
    })

})

