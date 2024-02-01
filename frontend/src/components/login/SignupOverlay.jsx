const SignupOverlay = ({ Icon, title }) => {
  return (
    <div className="sign_up__overlay">
      <p className="signup__overlay_text">
        <Icon /> <span> {title}</span>
      </p>
    </div>
  );
};
export default SignupOverlay