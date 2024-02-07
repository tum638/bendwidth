import Badge from "@mui/material/Badge";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const Topbar = () => {
  const navigate = useNavigate();
  const userDetails = useSelector((state) => state.userDetails);
  useEffect(() => {
    if (!sessionStorage.getItem("userData")) {
      sessionStorage.setItem("userData", JSON.stringify(userDetails));
    }
  }, [sessionStorage.getItem("userData")]);

  return (
    <div className="topbar">
      <div className="topbar__search">
        <i className="fa fa-search"></i>
        <input type="text" placeholder="Search" />
      </div>
      <div className="topbar__icons">
        <div className="topbar__icon_wrapper">
          <i className="fa-solid fa-bell"></i>
        </div>
        <div className="topbar__icon_wrapper">
          <Badge badgeContent={4} color="secondary">
            <i className="fa-solid fa-message"></i>
          </Badge>
        </div>
        <div className="user_profile">
          <div className="user__avatar_wrapper">
            <img src="https://picsum.photos/200/300" alt="user profile " />
          </div>
          <div
            className="profile__details"
            onClick={() => navigate("/main/profile")}
          >
            <h3 className="user__name">
              {userDetails.userName !== null
                ? userDetails.userName
                : JSON.parse(sessionStorage.getItem("userData"))["userName"]}
            </h3>
            <p className="user__school">
              {userDetails.collegeName !== null
                ? userDetails.collegeName
                : JSON.parse(sessionStorage.getItem("userData"))["collegeName"]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
