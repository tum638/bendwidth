import VideoButton from "./VideoButton";
import AudioButton from "./AudioButton";
import ShareScreenButton from "./ShareScreenButton";
import HangUpButton from "./HangUpButton";
import { useEffect, useRef } from "react";
const ActionButtons = ({ smallFeedEl, largeFeedEl }) => {
    const controlButtons = useRef(null);

    // control hiding of control buttons.
    useEffect(() => {
    let timer;

    const hideButtons = () => {
        timer = setTimeout(() => {
            if (controlButtons.current) {
                controlButtons.current.classList.add('hidden');
            }
        }, 3000);
    };

    const handleMouseMove = () => {
        if (controlButtons.current && controlButtons.current.classList.contains('hidden')) {
            controlButtons.current.classList.remove('hidden');
        }
        clearTimeout(timer);
        hideButtons();
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup function to remove event listener
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        clearTimeout(timer); // Clear timeout on component unmount
    };
}, []);
    return (
        <div ref={controlButtons} className="row video-buttons">
            <AudioButton />
            <VideoButton smallFeedEl={smallFeedEl}/>
            <ShareScreenButton />
            <HangUpButton smallFeedEl={smallFeedEl} largeFeedEl={largeFeedEl}/>
        </div>
    )
}

export default ActionButtons;