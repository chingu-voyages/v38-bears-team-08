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

interface responseType {
  message: string
  code: number
}


const SavedRecipes = () => {
  const user = useFirebaseAuth() || auth.currentUser
  const [userRecipes, setUserRecipes] = useState<saveRecipeType[] | []>()
  const [deleteResponse, setDeleteResponse] = useState<responseType>()
  const [showDeleteMessage, setShowDeleteMessage] = useState<boolean>(false)

  useEffect(() => {
    getUserRecipes(user as User).then(userRecipes => setUserRecipes(userRecipes))
  }, [user, userRecipes?.length])

  const messageTimer = () => {
    setShowDeleteMessage(true)
    setTimeout(() => {
      setShowDeleteMessage(false)
    }, 5000)
  }

  const deleteSavedRecipe = async (recipeId: string, user: User) => {
    try {
      const response: responseType = await deleteRecipe(recipeId, user)
      setUserRecipes(userRecipes?.filter((recipe: saveRecipeType) => recipe.id === recipeId))
      console.log(response)
      setDeleteResponse({
        message: response.message,
        code: response.code,
      })
      messageTimer()
    } catch(e: any) {
      console.log(e)
      setDeleteResponse({
        message: e.message,
        code: e.code,
      })
      messageTimer()
    }
  }

  const DeleteMessage = () => {
    return (
      <div id="delete-message-wrapper">
        <span id="delete-message">{deleteResponse?.message}</span>
      </div>
    )
  }

  return (
    <>
      <h2 id='save-recipes-heading'>{user ? user.displayName : ''}'s Recipes</h2>
      {showDeleteMessage ? <DeleteMessage /> : null}
      <div id='saved-recipes'>
        {userRecipes &&
          userRecipes.map((userRecipe: saveRecipeType) => (
            <div id='saved-recipe-wrapper' key={userRecipe.id}>
              <div
                id='delete-recipe-btn'
                onClick={() => deleteSavedRecipe(userRecipe.id, user as User)}>
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
