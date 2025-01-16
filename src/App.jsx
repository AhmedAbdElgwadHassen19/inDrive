
import { Route,  Routes } from "react-router-dom";
import Signup from "./components/SignUp";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar";
import Home from "./components/Home";


const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
          <Route path="/" element={<Home/>}/>
          <Route path="/profile" element={<Profile/>}/>
        
      </Routes>
    </div>
  )
}

export default App
