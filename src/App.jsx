import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import "./components/style.css";
import Message from "./components/message";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/message" element={<Message />} />
    </Routes>
  );
};

export default App;







// import React from "react";
// import { Routes, Route, Link } from "react-router-dom";
// import Login from "./components/Login";
// import Register from "./components/register";
// import "./components/style.css";


// const App = () => {
//   return (
//     <div>
//       <nav>
//         <Link to="/login">Login</Link> |{" "}
//         <Link to="/register">Register</Link>
//       </nav>

//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//       </Routes>
//     </div>
//   );
// };

// export default App;
