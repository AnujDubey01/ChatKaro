import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import getCurrentUser from './customHooks/getCurrentUser.jsx'

const App = () => {
  getCurrentUser();
  return (
   <Routes>
  <Route path="/" element={<Signup />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
</Routes>
  )
}

export default App