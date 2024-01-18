import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VideoPage from './videoComponents/VideoPage';



const Home = () => <h1>HomePage</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" Component={Home} />
        <Route path="/join-video" Component={VideoPage} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
