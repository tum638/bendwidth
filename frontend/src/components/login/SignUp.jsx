import React, { useState } from "react";
import Stepper from "awesome-react-stepper";
import { Grid } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SignupOverlay from "./SignupOverlay";
import ErrorIcon from "./ErrorIcon";

const SignUp = ({ setPage }) => {
  const userInfo = {
    full_name: "",
    email: "",
    password: "",
    password2: "",
    college_name: "",
    major: "",
    study_level: "",
    country: "",
    courses: "Courses Taken",
    age: "",
    gender: "",
    interests: "Interests",
    skills: "Skills",
    hobbies: "Hobbies",
  };

  const [userData, setData] = useState(userInfo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errMsg, setErrMess] = useState("");
  const navigate = useNavigate(); // Create navigate function

  const handleChange = (e) => {
    setData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Make the API call
      const response = await axios.post("http://localhost:8000/register/", {
        ...userData,
        username: userData.email,
      });
      setLoading(false);
      // redirect to the main page
      navigate("/main");
    } catch (error) {
      setLoading(false);
      setError(true);
      setErrMess(error.message);
      await sleep(2500);
      setError(false);
    }
  };

  return (
    <div className="sign_up">
      {loading && (
        <SignupOverlay
          Icon={CircularProgress}
          title="Creating new user. Please wait...."
        />
      )}
      {error && (
        <SignupOverlay
          Icon={ErrorIcon}
          title={`There was an error creating new account. Check that all fields are filled.`}
        />
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <div className="login__main_info">
            <p className="login__logo">Bendwidth</p>
            <h1 className="login__title">AI driven matching</h1>
            <p className="login__subtitle">
              Precisely pairs learners with real educators and other interested
              learners, optimizing educational outcomes through tailored
              learning experience
            </p>
            <div className="login__image">
              <img src="/ai-matching.png" alt="" />
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className="login__right-side">
            <div className="sign_up__forms">
              <Stepper
                showProgressBar={false}
                submitBtn={
                  <button
                    className="login__submit sign_up__button"
                    onClick={() => handleSubmit()}
                  >
                    Submit
                  </button>
                }
                continueBtn={
                  <button className="login__submit sign_up__button">
                    Next
                  </button>
                }
                backBtn={
                  <button className="login__submit sign_up__button">
                    Back
                  </button>
                }
              >
                {/* Page 1 */}
                <div className="page__1">
                  <h1 className="sign_form__title">Create an account</h1>
                  <p className="sign_form__short_desc">
                    Create an account to get started!
                  </p>

                  <div className="login__form_input">
                    <i className="fa-solid fa-user"></i>
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      name="full_name"
                      value={userData.full_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="login__form_input">
                    <i className="fa-solid fa-envelope"></i>
                    <input
                      type="email"
                      placeholder="Email"
                      name="email"
                      required
                      value={userData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="login__form_input">
                    <i className="fa-solid fa-lock"></i>
                    <input
                      type="password"
                      placeholder="Password"
                      required
                      value={userData.password}
                      name="password"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="login__form_input">
                    <i className="fa-solid fa-check-double"></i>
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      required
                      name="password2"
                      value={userData.password2}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Page 2 */}
                <div className="page__2">
                  <h1 className="sign_form__title">University Details</h1>
                  <p className="sign_form__short_desc">
                    Add information about your university, name major and level.
                  </p>

                  <div className="login__form_input">
                    <i className="fa-solid fa-building-columns"></i>
                    <input
                      type="text"
                      placeholder="Name of College"
                      required
                      name="college_name"
                      value={userData.college_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="login__form_input">
                    <i className="fa-solid fa-book"></i>
                    <input
                      type="text"
                      placeholder="Major"
                      required
                      name="major"
                      value={userData.major}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="login__form_input">
                    <i className="fa-solid fa-layer-group"></i>
                    <select
                      name="study_level"
                      value={userData.study_level}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Level of Study*
                      </option>
                      <option value="Freshman">Freshman (First Year)</option>
                      <option value="Sophomore">Sophomore (Second Year)</option>
                      <option value="Junior">Junior (Third Year)</option>
                      <option value="Senior">
                        Senior (Final Year/Graduate)
                      </option>
                    </select>
                  </div>

                  <div className="login__form_input">
                    <i className="fa-solid fa-earth-americas"></i>
                    <input
                      type="text"
                      placeholder="Country"
                      required
                      name="country"
                      value={userData.country}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="login__form_input">
                    <i className="fa-solid fa-book-open"></i>
                    <textarea
                      name="courses"
                      rows="1"
                      value={userData.courses}
                      onChange={handleChange}
                    >
                      Courses Taken
                    </textarea>
                  </div>
                </div>

                {/* Page 3 */}
                <div className="page__3">
                  <h1 className="sign_form__title">Demographics</h1>
                  <p className="sign_form__short_desc">
                    Fill in the following fields to complete your profile.
                  </p>

                  <div className="login__form_input">
                    <i className="fa-solid fa-user"></i>
                    <input
                      type="text"
                      placeholder="Age"
                      required
                      name="age"
                      value={userData.age}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="login__form_input">
                    <i className="fa-solid fa-envelope"></i>
                    <input
                      type="text"
                      placeholder="Gender"
                      required
                      name="gender"
                      value={userData.gender}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Page 4 */}
                <div className="page__4">
                  <h1 className="sign_form__title">Interests & Hobbies</h1>
                  <p className="sign_form__short_desc">
                    We try to match you with students who closely resemble your
                    profile.
                  </p>

                  <div className="login__form_input_top">
                    <i className="fa-solid fa-heart"></i>
                    <textarea
                      name="interests"
                      rows="2"
                      value={userData.interests}
                      onChange={handleChange}
                    >
                      Interests
                    </textarea>
                  </div>

                  <div className="login__form_input_top">
                    <i className="fa-solid fa-book-open"></i>
                    <textarea
                      name="skills"
                      rows="2"
                      value={userData.skills}
                      onChange={handleChange}
                    >
                      Skills
                    </textarea>
                  </div>

                  <div className="login__form_input_top">
                    <i className="fa-solid fa-people-robbery"></i>
                    <textarea
                      name="hobbies"
                      rows="2"
                      value={userData.hobbies}
                      onChange={handleChange}
                    >
                      Hobbies
                    </textarea>
                  </div>
                </div>
              </Stepper>

              <p className="not_member">
                Already a user?{" "}
                <span
                  className="login__signup"
                  onClick={() => setPage("login")}
                >
                  Login
                </span>
              </p>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default SignUp;





function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
