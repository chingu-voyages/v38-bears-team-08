import { useState, useEffect } from 'react'
import axios from 'axios'
import { useFirebaseAuth } from '../FirebaseAuthContext'
import { auth } from '../firebase/firebaseConfig'
import { useParams, useNavigate } from 'react-router-dom'
import { MdTimer, MdOutlineToday } from 'react-icons/md'
import { GiForkKnifeSpoon } from 'react-icons/gi'
import { addDocument as addRecipe } from '../firebase/firebase'


interface stepType {
  number: number
  step: string
}

interface recipeDataType {
  title: string
  summary: string
  servings: number
  dishType: string
  sourceName: string
  sourceUrl: string
  healthScore: number
  readyInMinutes: number
  image: string
  ingredients: [string]
  steps: [stepType]
}

interface ingredientType {
  original: string
}

const getRecipeInfo = async (id: string) => {
  try {
    console.log(id)
    const url = `/.netlify/functions/get-recipe/${id}`
    const response = await axios.get(url)
    // const response = await axios.get(
    //   `https://api.spoonacular.com/recipes/${id}/information?apiKey=f2998c2dba0c42f1b03c4774b90d04f5`
    // )
    // console.log(response)
    return response.data
  } catch (error) {
    console.log(error)
  }
}

const RecipePage = () => {
  /* Gets id for the specific recipe from the url */
  const { id } = useParams<string>()
  const [recipeData, setRecipeData] = useState<recipeDataType>({
    title: '',
    summary: '',
    servings: 0,
    dishType: '',
    sourceName: '',
    sourceUrl: '',
    healthScore: 0,
    readyInMinutes: 0,
    image: '',
    ingredients: [''],
    steps: [{ number: 0, step: '' }]
  })

  const user = useFirebaseAuth() || auth.currentUser
  const [recipeSaved, setRecipeSaved] = useState<boolean>(false)
  // const userRecipes = async () => {
  //   if (user) {
  //     await getUserRecipes(user.uid)
  //     // console.log(rec)
  //   }
  // }
  // userRecipes()

  useEffect(() => {
    const loadRecipeInfo = async () => {
      const {
        title,
        summary,
        servings,
        dishTypes,
        sourceName,
        sourceUrl,
        healthScore,
        readyInMinutes,
        image,
        extendedIngredients,
        analyzedInstructions
      } = await getRecipeInfo(id)
      setRecipeData({
        title,
        summary,
        servings,
        dishType: dishTypes[0],
        sourceName,
        sourceUrl,
        healthScore,
        readyInMinutes,
        image,
        ingredients: extendedIngredients.map(
          (ingredient: ingredientType) => ingredient.original
        ),
        steps: analyzedInstructions[0].steps.map((instruction: stepType) => ({
          number: instruction.number,
          step: instruction.step
        }))
      })
    }

    loadRecipeInfo()
  }, [id])

  const navigate = useNavigate()

  const saveRecipe = async () => {
    if (user) {
      await addRecipe(user.uid, {
        id,
        title: recipeData.title,
        img: recipeData.image
      })
      setRecipeSaved(true)
      setTimeout(() => {
        setRecipeSaved(false)
      }, 5000)
      console.log('user recipe has been added to the db')
    } else {
      navigate('/login', {
        state: { message: `Must be logged in to save ${recipeData.title}` }
      })
    }
  }

  const SaveSuccessMessage = () => {
    if (recipeSaved) {
      return (
        <span id='save-success-message'>{recipeData.title} recipe has been saved</span>
      )
    } else {
      return null
    }
  }

  return (
    <div id='recipe-page'>
      <SaveSuccessMessage />
      <div id='recipe-info'>
        <div id='recipe-main'>
          <h2 id='recipe-info-title'>{recipeData.title}</h2>
          <button id='recipe-save-btn' onClick={saveRecipe}>
            Save Recipe
          </button>
          <img src={recipeData.image} alt={recipeData.title} id='recipe-info-image' />
          <div id='recipe-info-cooking'>
            <div id='recipe-info-time-wrapper' className='recipe-data'>
              <MdTimer id='recipe-info-time-icon' />
              <span id='recipe-info-time' className='recipe-data-text'>
                {recipeData.readyInMinutes} mins
              </span>
            </div>
            <div id='recipe-info-servings-wrapper' className='recipe-data'>
              <GiForkKnifeSpoon id='recipe-info-servings-icon' />
              <span id='recipe-info-servings' className='recipe-data-text'>
                {recipeData.servings} {recipeData.servings === 1 ? 'serving' : 'servings'}
              </span>
            </div>
            <div id='recipe-info-dishType-wrapper' className='recipe-data'>
              <MdOutlineToday id='recipe-info-dishType-icon' />
              <span id='recipe-info-dishType' className='recipe-data-text'>
                {recipeData.dishType.slice(0, 1).toUpperCase()}
                {recipeData.dishType.slice(1)}
              </span>
            </div>
          </div>
          <div id='recipe-summary-wrapper'>
            <span
              id='recipe-summary'
              dangerouslySetInnerHTML={{ __html: recipeData.summary }}></span>
          </div>
        </div>
        <div id='recipe-details'>
          <div id='recipe-ingredients-wrapper'>
            <h3 id='recipe-ingredients-subheading'>Ingredients</h3>
            <ul id='recipe-ingredients-list'>
              {recipeData.ingredients.map((ingredient: string) => (
                <li id='recipe-ingredient' className='recipe-list-item' key={ingredient}>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
          <div id='recipe-steps-wrapper'>
            <h3 id='recipe-steps-subheading'>Instructions</h3>
            <ol id='recipe-steps'>
              {recipeData.steps.map((instruction: stepType) => (
                <li
                  id='recipe-step'
                  className='recipe-list-item'
                  key={instruction.number}>
                  {instruction.step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipePage
