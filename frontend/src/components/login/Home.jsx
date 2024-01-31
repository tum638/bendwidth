import Login from "./Login";
import SignUp from "./SignUp";

const Home = ({ current_page, setPage }) => {
  return (
    <div className="home">
      {current_page === "login" ? (
        <Login setPage={setPage} />
      ) : (
        <SignUp setPage={setPage} />
      )}
    </div>
  );
};

export default Home;
