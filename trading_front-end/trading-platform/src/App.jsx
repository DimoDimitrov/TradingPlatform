import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import {
  Dashboard,
  Login,
  Register,
  Profile,
} from "./components/fragments";

import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  return (
    <Router>
      <div className="app">
        <Header isLoggedIn={isLoggedIn} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>} />
          <Route path="/register" element={<Register isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
