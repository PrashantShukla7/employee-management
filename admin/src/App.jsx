import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import NewEmployee from './components/NewEmployee'
import AdminLogin from './components/AdminLogin'
import AdminRegister from './components/AdminRegister'
import List from './components/List'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Dashboard/>} />
      <Route path='/new/employee' element={<NewEmployee />} />
      <Route path='/login' element={<AdminLogin />} />
      <Route path='/register' element={<AdminRegister />} />
      <Route path='/employees' element={<List />} />
    </Routes>
  )
}

export default App