import { useState, useEffect } from 'react'
import { useFirebaseAuth } from '../FirebaseAuthContext'
import { auth } from '../firebase/firebaseConfig'
import { Link } from 'react-router-dom'
import { getAllUserRecipes } from '../firebase/firebase'

interface saveRecipeType {
  id: string
  title: string
  img: string
}

const SavedRecipes = () => {
  const user = useFirebaseAuth() || auth.currentUser
  const [userRecipes, setUserRecipes] = useState<saveRecipeType[]>([
    { id: '', title: '', img: '' }
  ])

  useEffect(() => {
    const retriveUserRecipesFromDB = async () => {
      /* TODO: Get specific user recipes from DB */
      if (user) {
        const recipes = await getAllUserRecipes(user.uid)
        setUserRecipes(recipes)
      }
    }
    retriveUserRecipesFromDB()
  }, [user])

  return (
    <>
      <h2 id='save-recipes-heading'>{user ? user.displayName : ''}'s Recipes</h2>
      <div id='saved-recipes'>
        {userRecipes.map((userRecipe: saveRecipeType) => (
          <Link key={userRecipe.id} to={`/${userRecipe.id}`} id='saved-recipe-link'>
            <div
              id='saved-recipe'
              style={{
                background: `linear-gradient(#00000065, #00000065), url(${userRecipe.img}) center no-repeat`,
                backgroundSize: 'cover'
              }}>
              <span id='saved-recipe-title'>{userRecipe.title}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}

export default SavedRecipes
