import GetRecipies from './components/AutoIngredientSearch'
import Header from './components/Header'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import { FirebaseAuthProvider } from './FirebaseAuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import RecipePage from './components/RecipePage'
import SavedRecipes from './components/SavedRecipes'
import AuthenticatedRoute from './components/AuthenticatedRoute'

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
            <Route path='/:recipeId' element={<RecipePage />} />
            <Route element={<AuthenticatedRoute />}>
              <Route path='/saved-recipes' element={<SavedRecipes />} />
            </Route>
          </Routes>
        </Router>
      </FirebaseAuthProvider>
    </div>
  )
}

export default App
