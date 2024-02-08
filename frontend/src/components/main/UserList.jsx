import React from "react";
import "./css/UserList.css";

const UserList = ({ users }) => {
  return (
    <div className="user_list">
      <h1 className="user_list__heading">
        All of your saved contacts will appear below!
      </h1>
      <div className="UserTable">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date Added</th>
              <th>Last Active</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-info">
                    <img
                      src={user.avatar}
                      alt={`${user.name}`}
                      className="user-avatar"
                    />
                    <div className="user-details">
                      <div className="user-name">{user.name}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="contact_dates">{user.dateAdded}</td>
                <td className="contact_dates">{user.lastActive}</td>
                <td>
                  <div
                    className={`role ${user.role
                      .replace(" ", "-")
                      .toLowerCase()}`}
                  >
                    {user.role}
                  </div>
                </td>
                <td className="contact_delete" title="Delete Contact">
                  <i className="fa-solid fa-trash"></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;

export const users = [
  {
    id: 1,
    name: "Glenn Fisher",
    email: "glenn.fisher@gmail.com",
    dateAdded: "May 02, 2022",
    lastActive: "Aug 28, 2022",
    role: "Student",
    avatar: "https://picsum.photos/200/300", // This should be the path to the avatar image file
  },
  {
    id: 2,
    name: "Zeina Vandermode",
    email: "zeina.vandermode@gmail.com",
    dateAdded: "Jun 15, 2022",
    lastActive: "Aug 28, 2022",
    role: "Tutor",
    avatar: "https://picsum.photos/200/300",
  },
  {
    id: 3,
    name: "Paulo Rodriguez",
    email: "paulo.rodriguez@gmail.com",
    dateAdded: "Jun 15, 2022",
    lastActive: "Aug 28, 2022",
    role: "Student",
    avatar: "https://picsum.photos/200/300",
  },
  {
    id: 4,
    name: "Gloria Edwards",
    email: "gloria.edwards@gmail.com",
    dateAdded: "Jun 23, 2022",
    lastActive: "Aug 27, 2022",
    role: "Tutor",
    avatar: "https://picsum.photos/200/300",
  },
];
