import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  setPersistence,
  browserSessionPersistence
} from 'firebase/auth'
import { auth } from './firebaseConfig'
import {
  getDocs,
  collection,
  getFirestore,
  doc,
  getDoc,
  CollectionReference,
  addDoc,
  deleteDoc,
  setDoc
} from 'firebase/firestore'

// Initialize Firestore service
const firestore = getFirestore()
// Get all recipes (a reference to the collection)
const collectionRef = collection(firestore, 'recipes')
// Get collection documents
const docs = getDocs(collectionRef).then(
  snapshot => {
    console.log('snapshot', snapshot.docs)
    return snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    }) // END map
  },
  error => {
    console.log('error', error)
  }
) //   END then
interface saveRecipeType {
  id: string
  title: string
  img: string
}
// console.log('collectionRef', collectionRef)
const addDocument = async (userId: string, recipeObject: saveRecipeType | {}) => {
  try {
    const docRef = await setDoc(
      doc(firestore, 'recipes', userId),
      {
        ...recipeObject
      },
      { merge: true }
    )
    console.log('Document written with ID: ', docRef)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}
// const docRef = doc(firestore, 'recipes', 'dvMw9D9zqVg9HRF0uriVZRWWCgD3')
// const docSnap = getDoc(docRef).then(docSnap => {
//   console.log('Document data:', docSnap.data())
// })

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type errorObject = {
  message: string
  code: number
}
collection(firestore, 'user_recipes')

const deleteRecipe = async (recipeId: string) => {
  try {
    const docRef = doc(firestore, 'recipes', recipeId)
    const docSnap = await getDoc(docRef)
    console.log('docSnap', docSnap)
    if (docSnap.exists()) {
      await deleteDoc(doc(firestore, 'recipes', recipeId))
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
    throw new Error(error.message)
  }
}

const registerUser = async (username: string, email: string, password: string) => {
  try {
    const newUser = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(newUser.user, {
      displayName: username
    })
    await addDocument(newUser.user.uid, {})

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

export { registerUser, login, logout, resetPassword, addDocument }
