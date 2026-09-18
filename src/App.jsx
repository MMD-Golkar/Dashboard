import { useState } from "react"
import {UserType} from "./components/before-auth"
import {Signin} from "./components/signin"
import { Routes, Route } from 'react-router-dom'
function App() {
  const [user, setUser] = useState({
    name: "" , 
    lastname: "" ,
    gender: "",
    age: "" , 
    password: "" ,
    status: "" ,
  })

  return (
    <>
      <Routes>
          <Route path="/" element={<UserType />} />
          <Route path="/signin" element={<Signin user={user} setUser={setUser}/>} />
      </Routes>
    </>
  )
}

export default App
