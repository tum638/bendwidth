import Grid from "@mui/material/Grid";

const Login = ({ setPage }) => {
  return (
    <div className="login">
      <Grid container>
        <Grid item xs={6}>
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
        <Grid item xs={6}>
          <div className="login__right-side">
            <div className="login__form">
              <h2 className="login__heading">Hi, welcome back!</h2>
              <div className="login__form_input">
                <i class="fa-solid fa-envelope"></i>
                <input type="email" placeholder="Email" required />
              </div>
              <div className="login__form_input">
                <i class="fa-solid fa-lock"></i>
                <input type="password" placeholder="Password" required />
              </div>
              <p className="forgot__password"> Forgot password</p>
              <button className="login__submit">Login</button>

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
