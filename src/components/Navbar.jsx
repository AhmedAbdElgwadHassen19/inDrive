import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  // مراقبة التغييرات في localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      setLoggedInUser(user);
    }
  }, [localStorage.getItem('currentUser')]); // إعادة التحميل عند تغيير localStorage

  const handleLogout = () => {
    localStorage.removeItem('currentUser'); // إزالة بيانات المستخدم
    setLoggedInUser(null); // تحديث حالة المستخدم
    navigate('/'); // إعادة التوجيه إلى صفحة التسجيل
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
      <div className="container-fluid">
        <Link to="/home" className="navbar-brand" style={{ fontSize: '25px', fontWeight: 'bold' }}>
        Home
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            
            {loggedInUser ? (
              <>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link mt-3" style={{ fontSize: '25px', fontWeight: 'bold' }}>
                    Profile
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <Link
                    to="#"
                    className="nav-link dropdown-toggle d-flex align-items-center"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {loggedInUser.image && (
                      <img
                        src={loggedInUser.image}
                        alt="Profile"
                        className="rounded-circle me-2"
                        width="60"
                        height="70"
                      />
                    )}
                    <span style={{ fontSize: '25px', fontWeight: 'bold' }}>{loggedInUser.name}</span>
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <button className="dropdown-item" onClick={handleLogout} style={{ fontSize: '25px', fontWeight: 'bold' }}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    <button className="btn btn-primary" style={{ fontSize: '25px', fontWeight: 'bold' }}>
                      Sign Up
                    </button>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    <button className="btn btn-primary" style={{ fontSize: '25px', fontWeight: 'bold' }}>
                      Log In
                    </button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;