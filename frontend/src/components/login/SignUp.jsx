import Stepper from "awesome-react-stepper";

import { Grid } from "@mui/material";

const SignUp = ({ setPage }) => {
  return (
    <div className="sign_up">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <div className="login__main_info">
            <h1 className="login__title">Lorem Ipsum</h1>
            <p className="login__subtitle">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Consequatur voluptate dolore necessitatibus ipsum quis voluptates
              dicta sed, quibusdam fugit nihil ducimus. Sint repellendus at
              omnis laborum, tempore tenetur impedit quae?
            </p>
            <img src="https://picsum.photos/200/300" alt="" />
          </div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className="login__right-side">
            <div className="sign_up__forms">
              <Stepper
                showProgressBar={false}
                submitBtn={
                  <button className="login__submit sign_up__button">
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
                onSubmit={(step) => alert(`Thank you!!! Final Step -> ${step}`)}
              >
                <div className="page__1">
                  <h1 className="sign_form__title">Create an account</h1>
                  <p className="sign_form__short_desc">
                    Create an account to get started!
                  </p>

                  <div className="login__form_input">
                    <i class="fa-solid fa-user"></i>
                    <input type="text" placeholder="Full Name" required />
                  </div>

                  <div className="login__form_input">
                    <i class="fa-solid fa-envelope"></i>
                    <input type="email" placeholder="Email" required />
                  </div>

                  <div className="login__form_input">
                    <i class="fa-solid fa-lock"></i>
                    <input type="password" placeholder="Password" required />
                  </div>
                </div>

                {/* Page 2 */}

                <div className="page__2">
                  <h1 className="sign_form__title">University Details</h1>
                  <p className="sign_form__short_desc">
                    Add information about your university, name major and level.
                  </p>

                  <div className="login__form_input">
                    <i class="fa-solid fa-user"></i>
                    <input type="text" placeholder="Name of College" required />
                  </div>

                  <div className="login__form_input">
                    <i class="fa-solid fa-envelope"></i>
                    <input type="text" placeholder="Major" required />
                  </div>

                  <div className="login__form_input">
                    <i class="fa-solid fa-envelope"></i>
                    <select name="level" id="">
                      <option value="" disabled selected>
                        Level of Study*
                      </option>
                      <option value="Freshman">Freshman (First Year)</option>
                      <option value="Sophomore">Sophomore (Second Year)</option>
                      <option value="Junior">Junior (Third Year)</option>
                      <option value="Senior">
                        Senior (Final Year/Graduate){" "}
                      </option>
                    </select>
                  </div>
                </div>

                {/* Page 3 */}
                <div className="page__3">
                  <h1 className="sign_form__title">Demographics</h1>
                  <p className="sign_form__short_desc">
                    Fill in the following fields to complete your profile.
                  </p>

                  <div className="login__form_input">
                    <i class="fa-solid fa-user"></i>
                    <input type="text" placeholder="Name of College" required />
                  </div>

                  <div className="login__form_input">
                    <i class="fa-solid fa-envelope"></i>
                    <input type="text" placeholder="Major" required />
                  </div>

                  <div className="login__form_input">
                    <i class="fa-solid fa-envelope"></i>
                    <select name="level" id="">
                      <option value="" disabled selected>
                        Level of Study*
                      </option>
                      <option value="Freshman">Freshman (First Year)</option>
                      <option value="Sophomore">Sophomore (Second Year)</option>
                      <option value="Junior">Junior (Third Year)</option>
                      <option value="Senior">
                        Senior (Final Year/Graduate){" "}
                      </option>
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
