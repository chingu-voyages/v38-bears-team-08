import { useState, useEffect } from 'react'
import { useFirebaseAuth } from '../FirebaseAuthContext'
import { auth } from '../firebase/firebaseConfig'
import { User } from 'firebase/auth'
import { Link } from 'react-router-dom'
import { getUserRecipes, deleteRecipe } from '../firebase/firebase'
import { ImCross } from 'react-icons/im'

interface saveRecipeType {
  id: string
  title: string
  img: string
}

const SavedRecipes = () => {
  const user = useFirebaseAuth() || auth.currentUser
  const [userRecipes, setUserRecipes] = useState<saveRecipeType[] | []>()

  const deleteSavedRecipe = async (recipeId: string) => {
    const result = await deleteRecipe(recipeId)
    console.log(result)
    return result
  }

  useEffect(() => {
    getUserRecipes(user as User).then(userRecipes => setUserRecipes(userRecipes))
  }, [user])

  return (
    <>
      <h2 id='save-recipes-heading'>{user ? user.displayName : ''}'s Recipes</h2>
      <div id='saved-recipes'>
        {userRecipes &&
          userRecipes.map((userRecipe: saveRecipeType) => (
            <div id='saved-recipe-wrapper' key={userRecipe.id}>
              <div
                id='delete-recipe-btn'
                onClick={() => deleteSavedRecipe(userRecipe.id)}>
                <ImCross />
              </div>
              <Link to={`/${userRecipe.id}`} id='saved-recipe-link'>
                <div
                  id='saved-recipe'
                  style={{
                    background: `linear-gradient(#00000065, #00000065), url(${userRecipe.img}) center no-repeat`,
                    backgroundSize: 'cover'
                  }}>
                  <span id='saved-recipe-title'>{userRecipe.title}</span>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </>
  )
}

export default SavedRecipes
