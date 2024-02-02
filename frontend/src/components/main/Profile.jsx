const Profile = () => {
  return (
    <div className="profile">
      <ProfileTop />
    </div>
  );
};

export default Profile;

const ProfileTop = () => {
  return (
    <div className="profile_top">
      <div className="profile_bg">
        <img src="/background.jpeg" alt="background image" />
      </div>
      <div className="profile_info">
        <div className="profile__img">
          <img src="/profile.jpeg" alt="user avatar" />
        </div>
        <div className="profile_info__text">
          <div className="profile__text_left">
            <h1 className="profile__name">
              <i className="fa-regular fa-user"></i> John Doe
            </h1>
            <p className="profile__college">
              <i className="fa-regular fa-envelope"></i> johndoe@williams.edu
            </p>
            <p className="profile__class_year">
              <i className="fa-solid fa-hourglass"></i> 19 years
            </p>
          </div>
          <div className="profile__text_right">
            <h1 className="profile__name">
              <i className="fa-solid fa-building-columns"></i> Williams College
            </h1>
            <p className="profile__college">
              <i className="fa-solid fa-user-graduate"></i> Computer Science |
              Junior
            </p>
            <p className="profile__class_year">
              <i className="fa-solid fa-book"></i> Algorithms and Data
              structures, Computer Systems, Web Programming
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
