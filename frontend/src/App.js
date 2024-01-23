import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VideoPage from "./videoComponents/VideoPage";
import Home from "./components/login/Home";
import Main from "./components/main/Main";
import { useState } from "react";

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
        <Route path="/join-video" Component={VideoPage} />
        <Route path="/main" Component={Main} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
