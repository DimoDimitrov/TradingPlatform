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
  const [user, setUser] = React.useState(null);
  const [assets, setAssets] = React.useState([]);
  const [transactions, setTransactions] = React.useState([]);

  return (
    <Router>
      <div className="app">
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user} setUser={setUser} assets={assets} setAssets={setAssets} transactions={transactions} setTransactions={setTransactions}/>
        <Routes>
          <Route path="/" element={<Dashboard isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}
           user={user} setUser={setUser} assets={assets} setAssets={setAssets} transactions={transactions} setTransactions={setTransactions}/> } />
          <Route path="/profile" element={<Profile isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}
           user={user} setUser={setUser} assets={assets} setAssets={setAssets} transactions={transactions} setTransactions={setTransactions}/>} />
          <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}
           user={user} setUser={setUser}/>} />
          <Route path="/register" element={<Register isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}
           user={user} setUser={setUser}/>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
