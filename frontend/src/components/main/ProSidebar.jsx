import { useEffect } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProSidebar = () => {
  const navigate = useNavigate();
  const userDetails = useSelector(state => state.userDetails);
  useEffect(() => {
    if (!sessionStorage.getItem('userData')) {
      sessionStorage.setItem('userData', JSON.stringify(userDetails));
    }
  }, [sessionStorage.getItem('userData')])
  return (
    <div className="sidebar">
      <Sidebar className="sidebar__">
        <h4 className="sidebar__brand">Bendwidth</h4>
        <Menu>
          <MenuItem onClick={() => navigate("/main")}>Study session</MenuItem>
          <MenuItem> Interviews </MenuItem>
          <MenuItem> Contacts </MenuItem>
          <MenuItem> Calendar </MenuItem>
          <MenuItem> Chats </MenuItem>
          <MenuItem onClick={() => navigate("/main/ai")}> AI </MenuItem>

          <div className="sidebar__bottom">
            <div className="upgrade__account">
              <i className="fa-regular fa-star"></i>
              <div className="upgrade__texts">
                <p className="upgrade__text">Upgrade plan</p>
                <p className="upgrade__text_info">Get the most of the</p>
              </div>
            </div>
            <div className="user_profile">
              <div className="user__avatar_wrapper">
                <img src="https://picsum.photos/200/300" alt="" />
              </div>
              <div
                className="profile__details"
                onClick={() => navigate("/main/profile")}
              >
                <h3 className="user__name">{userDetails.userName !== null ? userDetails.userName :JSON.parse(sessionStorage.getItem('userData'))["userName"]}</h3>
                <p className="user__school">{userDetails.collegeName !== null? userDetails.collegeName : JSON.parse(sessionStorage.getItem('userData'))["collegeName"]}| '25</p>
              </div>
            </div>
          </div>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default ProSidebar;
