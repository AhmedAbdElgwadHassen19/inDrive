import { useEffect, useState } from 'react';
import "../style/Profile.css";
import imag from "../../public/photo_2025-01-11_23-39-01.jpg";
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import Navbar from './Navbar';
function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [tripCount, setTripCount] = useState(0);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('currentUser'));
    if (userData) {
      setCurrentUser(userData);
      setImagePreview(userData.image);

      // قراءة عدد الرحلات من localStorage باستخدام البريد الإلكتروني
      const tripCounts = JSON.parse(localStorage.getItem('tripCounts')) || {};
      const userTripCount = tripCounts[userData.email] || 0;
      setTripCount(userTripCount);
    }
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        const updatedUser = { ...currentUser, image: reader.result };
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!currentUser) {
    return <div className="text-center mt-5">No user data available.</div>;
  }

  return (
    <>
    <Navbar/>
    <div className="Profile container mt-5">
      <div className="row">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-body text-lg-0 text-lg-center">
              <div className="profile-picture mb-3 col-8 col-lg-8 mx-lg-0 mx-lg-auto">
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="img-thumbnail"
                  style={{ width: "100%", height: "250px" }}
                />
              </div>
              <h1 className="card-title text-primary">{currentUser.name}</h1>
              <h3 className="card-text text-muted">{currentUser.email}</h3>
              <h4 className="card-text text-muted">عدد الرحلات: {tripCount}</h4>
              <div className="profile-text">
                <label htmlFor="image-upload" className="btn-custom">Change Picture</label>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-8">
          <div className="card-body text-lg-0 text-lg-center">
            <div className="profile-picture mb-3 col-8 col-lg-8 mx-md-0 mx-md-auto mx-lg-0 mx-lg-auto mt-3">
              <img
                src={imag}
                alt="Profile"
                className="img-thumbnail"
                style={{ width: "100%", height: "400px" }}
              />
            </div>
            <div className="Icon pb-3 ms-5 ms-lg-0">
              <FaFacebook fontSize={"35px"} color='blue' />
              <FaInstagram className='mx-5' fontSize={"35px"} color='rgb(209, 83, 69)' />
              <FaLinkedin fontSize={"35px"} color='#007bfffd' />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Profile;