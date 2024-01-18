import VideoButton from "./VideoButton";
import AudioButton from "./AudioButton";
import ShareScreenButton from "./ShareScreenButton";
import HangUpButton from "./HangUpButton";
const ActionButtons = ({smallFeedEl, largeFeedEl}) => {
    return (
        <div className="row video-buttons">
            <AudioButton />
            <VideoButton smallFeedEl={smallFeedEl}/>
            <ShareScreenButton />
            <HangUpButton />
        </div>
    )
}

export default ActionButtons;