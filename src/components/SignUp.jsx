import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../style/signup+login.css';

function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    image: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setFormData({ ...formData, image: reader.result }); // تحديث الحالة بالصورة الجديدة
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, name, password, image } = formData;

    if (!email || !name || !password || !image) {
      alert('Please fill out all fields.');
      return;
    }

    const storedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
    const emailExists = storedAccounts.some((account) => account.email === email);
    if (emailExists) {
      alert('This email is already registered.');
      return;
    }

    storedAccounts.push(formData);
    localStorage.setItem('accounts', JSON.stringify(storedAccounts));

    alert('Signup successful! Please log in.');
    navigate('/login'); // إعادة التوجيه إلى صفحة الدخول
  };

  return (
    <div className="signup-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg p-4 ">
              <h2 className="text-center mb-4 text-primary">Sign Up</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">Profile Image</label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    name="image"
                    onChange={handleImageChange}
                    accept="image/*"
                    required
                  />
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary btn-lg">Sign Up</button>
                </div>
                <div className="text-center mt-3">
                  <p>Already have an account? <Link to="/login" className="text-primary">Log In</Link></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;