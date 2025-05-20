
import { Route,  Routes } from "react-router-dom";
import Signup from "./components/SignUp";
import Login from "./components/Login";
import Profile from "./components/Profile";

import Home from "./components/Home";


const App = () => {
  return (
    <div>
      
      <Routes>
        <Route path="/" element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/profile" element={<Profile/>}/>
          
      </Routes>
    </div>
  )
}

export default App
