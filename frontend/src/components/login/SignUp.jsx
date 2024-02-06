import React, { useEffect, useRef, useState } from "react";
import Stepper from "awesome-react-stepper";
import { Grid } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SignupOverlay from "./SignupOverlay";
import ErrorIcon from "./ErrorIcon";
import { useDispatch, useSelector } from "react-redux";
import userDetails, { updateUserDetails } from "../../redux-elements/userDetails";
import pair from "../../redux-elements/pair";
import submitCredentials from "./submitCredentials";

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
    grad_date: "",
    interests: "Interests",
    preferred_language: "",
    skills: "Skills",
    hobbies: "Hobbies",
  };
  const dispatch = useDispatch();
  const [userData, setData] = useState(userInfo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [errMsg, setErrMess] = useState("");
  const [countriesList, setCountriesList] = useState([]);
  const [languagesList, setLanguagesList] = useState([]);
  const userDetails = useSelector(state => state.userDetails);
  const [collegeList, setCollegeList] = useState([]);
  const navigate = useNavigate(); // Create navigate function
  const dateInput = useRef(null);

  const handleChange = (e) => {
      setData({...userData, [e.target.name]: e.target.value})  
  };

  const handleDateChange = (e) => {
    setData({...userData, [e.target.name]: e.target.value})
  }

  const openDatePicker = () => {
    dateInput.current.showPicker();
  }

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await axios.get("https://restcountries.com/v3.1/all");
      response.data.sort((a, b) => a.name.common.localeCompare(b.name.common))
      console.log(response.data[150])
      setCountriesList(response.data);
    }
    fetchCountries();
  }, [])

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get("http://localhost:8000/get-languages/");
        setLanguagesList(response.data.codes);
      } catch (error) {
        console.log(error);
      }
    }
    fetchLanguages();
  },[])

  // useEffect(() => {
  //   const fetchColleges = async () => {
  //     const response = await axios.get("https://universities.hipolabs.com");
  //     response.data.sort((a, b) => a.name.localeCompare(b.name))
  //     // setCountriesList(response.data);
  //     console.log(response.data)
  //   } 
  //   fetchColleges();
  // }, [])

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log(userData);
      const response = await axios.post("http://localhost:8000/register/", {
        ...userData,
        username: userData.email,
      });
      console.log(response);
      setErrMess(userData.full_name)
      setLoading(true);
    
      // submit user credentials to backend for login.
      if (response.status === 201) { 
      const getSubmittedCredentials = async () => {
      const res = await submitCredentials(dispatch, userData.email, userData.password);

        if ("fullName" in res) {
        navigate("main/")
        } else {
        console.log(res)
        setError(true);
        setErrMess(res.response?.data?.error);
        sleep(2500);
        setError(false);
        }
      setLoading(false);
      }

      // submit user credentials to backend for login.
      getSubmittedCredentials();
      } else {
        console.log("throwed error")
        throw new Error("Something went wrong with the signup.")
    }
    } catch (error) {
      console.log("an error occured")
      console.log(error)
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
          title={errMsg}
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
                    <select
                      name="country"
                      value={userData.country}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Country*
                      </option>
                      {countriesList.map(country => <option key={country.name.official} value={country.name.common}>{country.flag} {country.name.common}</option>)}
                    </select>
                  </div>
                  <div className="login__form_input">
                    <i className="fa-solid fa-graduation-cap"></i>
                    <input
                      type="text"
                      placeholder="Graduation date (mm/dd/yyyy)"
                      required
                      name="grad_date"
                      onChange={openDatePicker}
                      onClick={openDatePicker}
                      value={userData.grad_date}
                    />
                    <input
                      name="grad_date"
                      ref={dateInput}
                      type="date"
                      className="date-signup"
                      onChange={handleDateChange}
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
                  <h1 className="sign_form__title">Language, Interests & Hobbies</h1>
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
                  <div className="login__form_input">
                    <i className="fa-solid fa-language"></i>
                    <select
                      name="preferred_language"
                      value={userData.preferred_language}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Preferred Language*
                      </option>
                      {languagesList.map(language => <option key={language[0]} value={language[0]}> {language[1]}</option>)}
                    </select>
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
