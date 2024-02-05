import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VideoPage from "./videoComponents/VideoPage";
import Home from "./components/login/Home";
import Main from "./components/main/Main";
import { useState } from "react";
import FindTutor from "./components/matching/FindTutor";
import FindFriends from "./components/matching/FindFriends";
import ChooseInterests from "./components/matching/ChooseInterests";

function App() {
  const [page, setPage] = useState("login");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={<Home current_page={page} setPage={setPage} />}
        />
        <Route path="/join-video" element={<VideoPage />} />
        <Route path="/main/*" element={<Main />} />
        <Route path="/tutor" element={<FindTutor />} />
        <Route path="/friend" element={<FindFriends />} />
        <Route path="/select-interests" element={<ChooseInterests />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
