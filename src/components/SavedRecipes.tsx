import { useState, useEffect } from 'react'
import { useFirebaseAuth } from '../FirebaseAuthContext'
import { auth } from '../firebase/firebaseConfig'
import { User } from 'firebase/auth'
import { Link } from 'react-router-dom'
import { getAllUserRecipes } from '../firebase/firebase'

interface saveRecipeType {
  id: string
  title: string
  img: string
}

const retriveUserRecipesFromDB = async (user: User) => {
  if (user) {
    const recipes = await getAllUserRecipes(user.uid)
    const arrayOfObj = Object.entries(recipes as saveRecipeType).map(e => ({
      [e[0]]: e[1]
    }))
    const arrformobj = Object.values(arrayOfObj)
      .map(e => Object.values(e))
      .flat()
    console.log('arrayOfObj', arrayOfObj)
    console.log('arrformobj', arrformobj)
    return arrformobj
  }
}

const SavedRecipes = () => {
  const user = useFirebaseAuth() || auth.currentUser
  const [userRecipes, setUserRecipes] = useState<saveRecipeType[] | []>()

  useEffect(() => {
    async function getUserRecipes() {
      if (window.sessionStorage.getItem('userRecipes')) {
        const userRecipes = JSON.parse(
          window.sessionStorage.getItem('userRecipes') as string
        )
        console.log('userRecipes from sessionStorage', userRecipes)
        setUserRecipes(userRecipes)
      } else {
        const userRecipes = await retriveUserRecipesFromDB(user as User)
        console.log('userRecipes from db', userRecipes)
        window.sessionStorage.setItem('userRecipes', JSON.stringify(userRecipes))
        setUserRecipes(userRecipes)
      }
    }
    getUserRecipes()
  }, [user])

  return (
    <>
      <h2 id='save-recipes-heading'>{user ? user.displayName : ''}'s Recipes</h2>
      <div id='saved-recipes'>
        {userRecipes &&
          userRecipes.map((userRecipe: saveRecipeType) => (
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
