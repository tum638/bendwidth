import Profile from "./Profile";
import VideoCards from "./VideoCards";
import Topbar from "./Topbar";
import { Routes, Route } from "react-router-dom";
import FindTutor from "../matching/FindTutor";
import FindFriends from "../matching/FindFriends";
import SendNotifications from "../notifications/notifications";

const MainContent = () => {
  return (
    <div className="main_content">
      <Topbar />
      <Routes>
        <Route exact path="/" element={<VideoCards />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/findtutor" element={<FindTutor />} />
        <Route path="/findfriend" element={<FindFriends />} />
        <Route path="/ai" element={<SendNotifications />}/>
      </Routes>
    </div>
  );
};

export default MainContent;
