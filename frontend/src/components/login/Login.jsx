import Grid from "@mui/material/Grid";
import { useRef, useState } from "react";
import { CircularProgress } from "@mui/material";
import SignupOverlay from "./SignupOverlay";
import ErrorIcon from "./ErrorIcon";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUserDetails } from "../../redux-elements/userDetails";
import pair from "../../redux-elements/pair";

const Login = ({ setPage }) => {
  const dispatch = useDispatch();

  // user details.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false);
  const [errMsg, setErrMess] = useState("");
  const navigate = useNavigate(); // Create navigate function

  const usernameEl = useRef(null);
  const passwordEl = useRef(null);


  const handleDataChange = (e) => {
    if (e.target.type === "email") {
      setEmail(e.target.value);
    } else if (e.target.type === "password") {
      setPassword(e.target.value);
    }
  }
  
  const handleSubmit = () => {
    setLoading(true);
    const submitCredentials = async () => {
      try {
        const response = await axios.post("http://localhost:8000/login/",{
        email,
        password,
        })
        console.log(response)
        if (response.status === 200) {
          console.log(response.data.user_id)
          dispatch(updateUserDetails(pair("isLoggedIn", true)));
          dispatch(updateUserDetails(pair("userName", response.data.full_name)));
          dispatch(updateUserDetails(pair("userId", response.data.user_id)));
          setLoading(false);
          setErrMess(response.data.full_name);
          navigate("main/", {state: {fullName: response.data.full_name, collegeName: response.data.college_name}})
        }
      } catch (error) {
        console.log(error)
        setLoading(false);
        setError(true);
        setErrMess(error.response.data.error);
        await sleep(2500);
        setError(false);
      }
    }
    submitCredentials();
  }

  return (
    
      
    <div className="login">
      {loading && (
        <SignupOverlay
          Icon={CircularProgress}
          title={`Welcome, ${errMsg} `}
        />
      )}
      {error &&  (
        <SignupOverlay
          Icon={ErrorIcon}
          title={errMsg}
        />
      )}
      <Grid container>
        <Grid item xs={6}>
          <div className="login__main_info">
            <p className="login__logo">Bendwidth</p>

            <div className="login__display">
                <div className="login__image">
                  <img src="/ai-matching.png" alt="" />
                </div>
                <div className="login__punchline">
                Matching <span className="learner">learners</span> with real educators and other interested
                <span className="learner"> learners</span>, optimizing educational outcomes through tailored
                <span className="learner"> learning</span> experience.
                </div>
            </div>
                  <h1 className="login__title">AI driven matching</h1>
            
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="login__right-side">
            <div className="login__form" onChange={handleDataChange}>
              <h2 className="login__heading">Hi, welcome back!</h2>
              <div className="login__form_input">
                <i class="fa-solid fa-envelope"></i>
                <input ref={usernameEl} type="email" placeholder="Email" required  />
              </div>
              <div className="login__form_input">
                <i class="fa-solid fa-lock"></i>
                <input ref={passwordEl} type="password" placeholder="Password" required />
              </div>
              <p className="forgot__password"> Forgot password</p>
              <button className="login__submit" onClick={handleSubmit}>Login</button>

              <p className="not_member">
                Not a member?{" "}
                <span
                  className="login__signup"
                  onClick={() => setPage("signup")}
                >
                  Sign up
                </span>
              </p>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}