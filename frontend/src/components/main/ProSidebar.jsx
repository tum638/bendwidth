import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";

const ProSidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <Sidebar className="sidebar__">
        <h4 className="sidebar__brand">Bendwidth</h4>
        <Menu>
          <MenuItem onClick={() => navigate("/main")}>Study session</MenuItem>
          <MenuItem> Interviews </MenuItem>
          <MenuItem> Contacts </MenuItem>
          <MenuItem> Tutors </MenuItem>
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
                <h3 className="user__name">John Doe</h3>
                <p className="user__school">Williams College | '25</p>
              </div>
            </div>
          </div>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default ProSidebar;
