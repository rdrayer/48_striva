import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './App';

function NavBar() {
  const { currentUser, logout } = useContext(UserContext);

  const handleLogout = (e) => {
    logout();
  };

  return (
    <nav className="navbar">
      <Link to="/">Striva</Link>
      {currentUser && (
        <>
          {" | "}
          <Link to={`/users/${currentUser.username}`}>Profile</Link>
        </>
      )}
      {currentUser ? (
        <>
          {" | "}
          <Link to="/" onClick={handleLogout}>
            Logout {currentUser.firstName || currentUser.username}
          </Link>
        </>
      ) : (
        <>
          {" | "}
          <Link to="/login">Login</Link>
          {" | "}
          <Link to="/signup">Signup</Link>
        </>
      )}
    </nav>
  );
}

export default NavBar;
