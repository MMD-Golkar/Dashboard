import { useState } from "react";
import { UserType } from "./components/before-auth";
import { Signin } from "./components/signin";
import { Signup } from "./components/signup";
import { Dashboard } from "./components/dashboard.jsx";
import {ProtectedRoute} from "./components/ProtectedRoute.jsx"
import { Routes, Route } from "react-router-dom";
function App() {
  const [user, setUser] = useState({
    name: "",
    lastname: "",
    gender: "",
    age: "",
    password: "",
    status: "",
  });

  return (
    <>
      <Routes>
        <Route path="/" element={<UserType />} />
        <Route
          path="/signin"
          element={<Signin user={user} setUser={setUser} />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
