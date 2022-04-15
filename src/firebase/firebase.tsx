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

// console.log('collectionRef', collectionRef)
const addDocument = async (userId: string) => {
  try {
    const docRef = await setDoc(
      doc(firestore, 'recipes', userId),
      {
        title: 'Fish & Chips',
        img: 'https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe/recipe-image/2017/05/frying-pan-pizza-crust-recipe-image.jpg?itok=ZzQ8s5ka',
        ingredients: [
          '1 tbsp olive oil',
          '1 onion, chopped',
          '2 garlic cloves, crushed',
          '2 tbsp chopped fresh parsley',
          '1 tbsp chopped fresh thyme',
          '2 tbsp chopped fresh rosemary',
          '1 tbsp chopped fresh oregano',
          '1 tbsp chopped fresh basil',
          '1 tbsp chopped fresh sage',
          '1 tbsp chopped fresh fennel',
          '1 tbsp chopped fresh dill'
        ]
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
const saveRecipe = async (recipe: any, user_id: CollectionReference) => {
  collection(firestore, 'user_recipes')
  // doc(user_id).set({ recipe }, { merge: true })
}

const deleteRecipe = async (recipeId: string) => {}

const registerUser = async (username: string, email: string, password: string) => {
  try {
    const newUser = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(newUser.user, {
      displayName: username
    })
    await addDocument(newUser.user.uid)

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
