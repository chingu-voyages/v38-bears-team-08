// import React, { createContext, useEffect } from 'react'
import GetRecipies from './components/AutoIngredientSearch'
import Header from './components/Header'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import { FirebaseAuthProvider } from './FirebaseAuthContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <div className='App'>
      <FirebaseAuthProvider>
        <Router>
          <Header />
          <Routes>
            <Route path='/' element={<GetRecipies />} />
            <Route
              path='/register'
              element={
                <ProtectedRoute redirectPath='/'>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path='/login'
              element={
                <ProtectedRoute redirectPath='/'>
                  <Login />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </FirebaseAuthProvider>
    </div>
  )
}

export default App
