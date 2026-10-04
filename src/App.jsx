import { useState } from "react";
import { UserType } from "./components/before-auth";
import { Signin } from "./components/signin";
import { Signup } from "./components/signup";
import { Dashboard } from "./components/dashboard.jsx";
import Help from "./components/Help.jsx";
import Support from "./components/Support.jsx"
import Terms from "./components/Terms.jsx"
import Privacy from "./components/Privacy.jsx"
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
        <Route path="/help" element={<Help />}></Route>
        <Route path="/support" element={<Support />}></Route>
        <Route path="/terms" element={<Terms />}></Route>
        <Route path="/privacy" element={<Privacy />}></Route>
      </Routes>
    </>
  );
}

export default App;
