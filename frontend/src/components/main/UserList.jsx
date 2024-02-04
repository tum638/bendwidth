import React from "react";
import "./css/UserList.css";

const UserList = ({ users }) => {
  return (
    <div className="UserTable">
      <table>
        <thead>
          <tr>
            <th>NAME</th>
            <th>DATE ADDED</th>
            <th>LAST ACTIVE</th>
            <th>ROLE</th>
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
              <td>{user.dateAdded}</td>
              <td>{user.lastActive}</td>
              <td>
                <div
                  className={`role ${user.role
                    .replace(" ", "-")
                    .toLowerCase()}`}
                >
                  {user.role}
                  <span className="dropdown-icon">▼</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
    role: "Administrator",
    avatar: "https://picsum.photos/200/300", // This should be the path to the avatar image file
  },
  {
    id: 2,
    name: "Zeina Vandermode",
    email: "zeina.vandermode@gmail.com",
    dateAdded: "Jun 15, 2022",
    lastActive: "Aug 28, 2022",
    role: "Administrator",
    avatar: "https://picsum.photos/200/300",
  },
  {
    id: 3,
    name: "Paulo Rodriguez",
    email: "paulo.rodriguez@gmail.com",
    dateAdded: "Jun 15, 2022",
    lastActive: "Aug 28, 2022",
    role: "Standard user",
    avatar: "https://picsum.photos/200/300",
  },
  {
    id: 4,
    name: "Gloria Edwards",
    email: "gloria.edwards@gmail.com",
    dateAdded: "Jun 23, 2022",
    lastActive: "Aug 27, 2022",
    role: "Standard user",
    avatar: "https://picsum.photos/200/300",
  },
];
