import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'

const App = () => {
  return (
    <Routes>
      <Route path='/Login' element={<Login/>} />
      <Route path='/Signup' element={<Signup/>} />
    </Routes>
  )
}

export default App