import Badge from "@mui/material/Badge";

const Topbar = () => {
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
        <div className="user__avatar_wrapper">
          <img src="https://picsum.photos/200/300" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
