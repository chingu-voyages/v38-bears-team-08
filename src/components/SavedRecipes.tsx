import { useState, useEffect, FC } from 'react'
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

interface messageType {
  message: string
  type: string
}

const SavedRecipes = () => {
  const user = useFirebaseAuth() || auth.currentUser
  const [userRecipes, setUserRecipes] = useState<saveRecipeType[] | []>()
  const [saveMessage, setSaveMessage] = useState<messageType>({
    message: '',
    type: ''
  })

  const deleteSavedRecipe = async (recipeId: string, user: User) => {
    try {
      const result = await deleteRecipe(recipeId, user)
      result.code === 200
        ? setSaveMessage({ message: result.message, type: 'success' })
        : setSaveMessage({ message: result.message, type: 'error' })

      const timeout = setTimeout(() => {
        setSaveMessage({ message: '', type: '' })
        clearTimeout(timeout)
      }, 4000)
      getUserRecipes(user as User).then(userRecipes => setUserRecipes(userRecipes))
    } catch (error: any) {
      console.log('server Error:', error)
      setSaveMessage({ message: error.message, type: 'error' })
      const timeout = setTimeout(() => {
        setSaveMessage({ message: '', type: '' })
        clearTimeout(timeout)
      }, 4000)
    }
  }

  useEffect(() => {
    getUserRecipes(user as User).then(userRecipes => setUserRecipes(userRecipes))
  }, [user])

  const RenderMessage: FC<messageType> = ({ message, type }) => {
    if (type === 'success') return <div id='message-success'>{message}</div>
    else if (type === 'error') return <div id='message-error'>{message}</div>
    else return null
  }
  return (
    <>
      <h2 id='save-recipes-heading'>{user ? user.displayName : ''}'s Recipes</h2>
      <div id='save-message'>
        <RenderMessage message={saveMessage.message} type={saveMessage.type} />
      </div>
      <div id='saved-recipes'>
        {userRecipes &&
          userRecipes.map((userRecipe: saveRecipeType) => (
            <div className='saved-recipe-wrapper' key={userRecipe.id}>
              <div
                className='delete-recipe-btn'
                onClick={() => deleteSavedRecipe(userRecipe.id, user as User)}>
                <ImCross />
              </div>
              <Link to={`/${userRecipe.id}`} className='saved-recipe-link'>
                <div
                  className='saved-recipe'
                  style={{
                    background: `linear-gradient(#00000065, #00000065), url(${userRecipe.img}) center no-repeat`,
                    backgroundSize: 'cover'
                  }}>
                  <span className='saved-recipe-title'>{userRecipe.title}</span>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </>
  )
}

export default SavedRecipes
