import Grid from "@mui/material/Grid";
import { useEffect, useRef, useState } from "react";
import { CircularProgress } from "@mui/material";
import SignupOverlay from "./SignupOverlay";
import ErrorIcon from "./ErrorIcon";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateUserDetails, updateWholeUserObject } from "../../redux-elements/userDetails";
import pair from "../../redux-elements/pair";
import submitCredentials from "./submitCredentials";
import {jwtDecode } from 'jwt-decode'

const Login = ({ setPage }) => {
  const dispatch = useDispatch();

  // user details.
  const [data, setData] = useState({ email: "", password: "" });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errMsg, setErrMess] = useState("");
  const navigate = useNavigate(); // Create navigate function

  const [searchParams, setSearchParams] = useSearchParams();
    const token = searchParams.get("token")
    
    // load user data if user is a respondent.
    useEffect(() => {
        const getKey = async () => {
            try {
                const userData = jwtDecode(token);
                console.log(userData)
                dispatch(updateWholeUserObject(userData));
                sessionStorage.setItem('userData', JSON.stringify(userData));
                dispatch(updateUserDetails(pair("isLoggedIn", true)));
                dispatch(updateUserDetails(pair("userName", userData.fullName)));
                dispatch(updateUserDetails(pair("userId", userData.userId)));
                dispatch(updateUserDetails(pair("userEmail", userData.userEmail)));
                dispatch(updateUserDetails(pair("collegeName", userData.collegeName)));
                dispatch(updateUserDetails(pair("isInquirer", false)));
                dispatch(updateUserDetails(pair("isRespondent", true)));
                dispatch(updateUserDetails(pair("uuid", userData.uuid)))
                dispatch(updateUserDetails(pair("gradDate", userData.gradDate)));
                navigate("/main/lobby")
            } catch (err) {
                navigate("/")
            }
            
        }
        if (token) {
            console.log("got here")
            getKey();
        }    
    }, [token])

  const handleDataChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    
    const getSubmittedCredentials = async () => {
      setLoading(true);
      const res = await submitCredentials(dispatch, data.email, data.password);
      if ("fullName" in res) {
        setErrMess(res.fullName);
        navigate("main/");
      } else {
        setLoading(false)
        console.log(res);
        setError(true);
        setErrMess(res.response?.data?.error);
        await sleep(2500);
        setError(false);
      }
      setLoading(false);
    };

    // submit user credentials to backend for login.
    getSubmittedCredentials();
  };

  return (
    <div className="login">
      {loading && <SignupOverlay Icon={CircularProgress} title={`Loading...`} />}
      {error && <SignupOverlay Icon={ErrorIcon} title={errMsg} />}

      <div className="login__content">
        <div className="login__logo">
          <p className="login__logo_name">
            <img src="/logo.png" alt="logo" /> Bendwidth
          </p>
        </div>
        <h1 className="login__title">Welcome Back</h1>
        <p className="login__desc">
          Connect and collaborate with peers across the globe for interactive
          study sessions and realistic mock interviews. Discover a community
          dedicated to academic growth and professional preparation, all at your
          fingertips.
        </p>
        <div>
          <div className="login__form_input">
            <i class="fa-solid fa-envelope"></i>
            <input
              value={data.email}
              type="email"
              placeholder="Email"
              required
              name="email"
              onChange={handleDataChange}
            />
          </div>
          <div className="login__form_input">
            <i class="fa-solid fa-lock"></i>
            <input
              value={data.password}
              type="password"
              placeholder="Password"
              required
              name="password"
              onChange={handleDataChange}
            />
          </div>
          <p className="forgot__password"> Forgot password</p>
          <button className="login__submit" onClick={handleSubmit}>
            Login
          </button>

          <p className="not_member">
            Not a member?{" "}
            <span className="login__signup" onClick={() => setPage("signup")}>
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//{loading && <SignupOverlay Icon={CircularProgress} title={`Welcome!`} />}
// {error && <SignupOverlay Icon={ErrorIcon} title={errMsg} />}
// <Grid container>
//   <Grid item xs={12} md={6}>
//     <div className="login__main_info">
//       <p className="login__logo">Bendwidth</p>

//       <div className="login__display">
//         <h1 className="login__title">AI driven matching</h1>
//         <div className="login__punchline">
//           Matching <span className="learner">learners</span> with real
//           educators and other interested
//           <span className="learner"> learners</span>, optimizing
//           educational outcomes through tailored
//           <span className="learner"> learning</span> experience.
//         </div>
//         <div className="login__image">
//           <img src="/ai-matching.png" alt="" />
//         </div>
//       </div>
//     </div>
//   </Grid>
//   <Grid item xs={12} md={6}>
//     <div className="login__right-side">
//       <div className="login__form" onChange={handleDataChange}>
//         <h2 className="login__heading">Hi, welcome back!</h2>
//         <div className="login__form_input">
//           <i class="fa-solid fa-envelope"></i>
//           <input
//             ref={usernameEl}
//             type="email"
//             placeholder="Email"
//             required
//           />
//         </div>
//         <div className="login__form_input">
//           <i class="fa-solid fa-lock"></i>
//           <input
//             ref={passwordEl}
//             type="password"
//             placeholder="Password"
//             required
//           />
//         </div>
//         <p className="forgot__password"> Forgot password</p>
//         <button className="login__submit" onClick={handleSubmit}>
//           Login
//         </button>

//         <p className="not_member">
//           Not a member?{" "}
//           <span
//             className="login__signup"
//             onClick={() => setPage("signup")}
//           >
//             Sign up
//           </span>
//         </p>
//       </div>
//     </div>
//   </Grid>
// </Grid>
// </div>
