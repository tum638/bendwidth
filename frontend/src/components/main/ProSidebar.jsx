import axios from "axios";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";

const ProSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await axios.get("http://localhost:8000/logout/");
    console.log(response)
    sessionStorage.clear();
    navigate('/');
  }
  return (
    <div className="sidebar">
      <Sidebar className="sidebar__">
        <h4 className="sidebar__brand">
          {" "}
          <img src="/logo.png" alt="logo" /> Bendwidth
        </h4>
        <Menu>
          <MenuItem onClick={() => navigate("/main")} className="active_link">
            <i className="fa-solid fa-chalkboard-user"></i> Study session
          </MenuItem>
          <MenuItem onClick={() => navigate("/main/interview")}>
            <i className="fa-solid fa-clipboard-question"></i> Interviews
          </MenuItem>
          <MenuItem onClick={() => navigate("/main/contacts")}>
            <i className="fa-regular fa-address-card"></i> Contacts
          </MenuItem>
          <MenuItem onClick={() => navigate("/main/calendar")}>
            <i className="fa-regular fa-calendar-days"></i> Calendar
          </MenuItem>
          <MenuItem onClick={() => navigate("/main/chats")}>
            <i className="fa-solid fa-message"></i> Chats{" "}
          </MenuItem>
          <MenuItem onClick={() => navigate("/main/ai")}>
            {" "}
            <i className="fa-solid fa-brain"></i> AI Avartars
          </MenuItem>

          <div className="sidebar__bottom">
            {/* <div className="upgrade__account">
              <i className="fa-regular fa-star"></i>
              <div className="upgrade__texts">
                <p className="upgrade__text">Upgrade plan</p>
                <p className="upgrade__text_info">Get the most of the</p>
              </div>
            </div> */}
            <p className="logout" onClick={handleLogout}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
            </p>

          </div>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default ProSidebar;
