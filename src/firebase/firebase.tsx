import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  setPersistence,
  browserSessionPersistence,
  User
} from 'firebase/auth'
import { auth } from './firebaseConfig'
import {
  getDocs,
  collection,
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  deleteField,
  setDoc
} from 'firebase/firestore'

// Initialize Firestore service
const firestore = getFirestore()
// Get all recipes (a reference to the collection)
const collectionRef = collection(firestore, 'recipes')
// Get collection documents
interface saveRecipeType {
  id: string
  title: string
  img: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface errorObject {
  message: string
  code: number
}

/**
 * To be used in addRecipe
 * @param {saveRecipeType} recipe
 * @returns void
 */
const addRecipeToSessionStorage = (recipe: saveRecipeType) => {
  const userRecipes = JSON.parse(window.sessionStorage.getItem('userRecipes') as string)
  window.sessionStorage.setItem('userRecipes', JSON.stringify(userRecipes.concat(recipe)))
}
const addRecipe = async (userId: string, recipe: saveRecipeType) => {
  try {
    const docRef = await setDoc(
      doc(firestore, 'recipes', userId),
      {
        [recipe.id]: { ...recipe }
      },
      { merge: true }
    )
    addRecipeToSessionStorage(recipe)
    console.log('Document written with ID: ', docRef)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

const getAllUserRecipes = async (userId: string) => {
  try {
    const userRecipes = await getDoc(doc(firestore, 'recipes', userId))
    console.log('userRecipes', userRecipes.data())
    return userRecipes.data()
  } catch (error: errorObject | any) {
    console.log(error)
    throw new Error(error)
  }
}

/**
 * @param {User} user
 * This function (given a valid user)
 * will check if there are recipes in saved in session storage
 * add will return them.
 * If there are no recipes in session storage,
 * will fetch them from firestore and add them to session storage
 */
// TODO: Test function with empty db
async function getUserRecipes(user: User) {
  if (user) {
    if (window.sessionStorage.getItem('userRecipes')) {
      const userRecipes = JSON.parse(
        window.sessionStorage.getItem('userRecipes') as string
      )
      console.log('userRecipes from sessionStorage', userRecipes)
      return userRecipes
    } else {
      const recipes = await getAllUserRecipes(user.uid)
      const userRecipes = Object.entries(recipes as saveRecipeType).map(r => r[1])
      console.log('userRecipes from db', userRecipes)
      window.sessionStorage.setItem('userRecipes', JSON.stringify(userRecipes))
      return userRecipes
    }
  } else return void 0
}

/**
 * @param {string} recipeId
 * To be used in deleteRecipe
 */
const removeRecipeFromSessionStorage = (recipeId: string) => {
  const userRecipes = window.sessionStorage.getItem('userRecipes')
  if (userRecipes) {
    const recipes = JSON.parse(userRecipes as string)
    const updatedUserRecipes = recipes.filter(
      (recipe: saveRecipeType) => recipe.id !== recipeId
    )
    window.sessionStorage.setItem('userRecipes', JSON.stringify(updatedUserRecipes))
  } else return void 0
}

const deleteRecipe = async (recipeId: string, user: User) => {
  try {
    const docRef = doc(firestore, `recipes/${user.uid}`)
    console.log('docRef', docRef)
    console.log('docRef.id', docRef.id)
    const docSnap = await getDoc(docRef)
    console.log('docSnap.exists()', docSnap.exists())
    console.log('docSnap.data()', docSnap.data())
    const recipeExists = docSnap.data()?.[recipeId]
    console.log('docSnap.data()[recipeId]', recipeExists)
    if (docSnap.exists() && recipeExists) {
      await updateDoc(docRef, { [recipeId]: deleteField() })
      removeRecipeFromSessionStorage(recipeId)
      return {
        message: 'Recipe deleted',
        code: 200
      }
    } else {
      return {
        message: 'Recipe not found',
        code: 404
      }
    }
  } catch (error: errorObject | any) {
    console.log(error)
    throw new Error(error)
  }
}

const registerUser = async (username: string, email: string, password: string) => {
  try {
    const newUser = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(newUser.user, {
      displayName: username
    })
    // await addDocument(newUser.user.uid, {})

    console.log('registerUser newUser', newUser)
    return {
      message: 'You have successfully registered',
      code: 200
    }
  } catch (error: errorObject | any) {
    console.log()
    console.log('registerUser error', error)
    throw new Error(error)
  }
}

const login = async (email: string, password: string) => {
  try {
    await setPersistence(auth, browserSessionPersistence)
    const currentUser = await signInWithEmailAndPassword(auth, email, password)
    console.log('currentUser', currentUser)
    return currentUser.user
  } catch (error: errorObject | any) {
    console.log('error.message', error.message)
    console.log('error.code', error.code)
    console.log('error.name', error.name)
    throw new Error(error.message)
  }
}

const logout = async () => {
  try {
    const logOutUser = await signOut(auth)
    console.log('logOutUser', logOutUser)
    window.sessionStorage.clear()
    return {
      message: 'You have successfully logged out',
      code: 200
    }
  } catch (error: errorObject | any) {
    console.log(error)
    throw new Error(error.message)
  }
}

const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email)
    return {
      message: 'Password reset email sent',
      code: 200
    }
  } catch (error: errorObject | any) {
    console.log(error)
    throw new Error(error.message)
  }
}

export {
  registerUser,
  login,
  logout,
  resetPassword,
  addRecipe,
  deleteRecipe,
  getUserRecipes
}
