import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Message from "./components/message";
import ChatPage from "./components/chatpage";
import "./components/style.css";
import { getToken } from "./utils/auth";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) setIsLoggedIn(true);
  }, []);

  return (
    <Router>
      <Routes>
        {/* root: send to login if not logged in */}
        <Route path="/" element={isLoggedIn ? <Navigate to="/message" /> : <Navigate to="/login" />} />

        {/* auth pages */}
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register />} />

        {/* protected pages */}
        <Route path="/message" element={isLoggedIn ? <Message /> : <Navigate to="/login" />} />
        <Route path="/chat" element={isLoggedIn ? <ChatPage /> : <Navigate to="/login" />} />

        {/* fallback */}
        <Route path="./login" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
