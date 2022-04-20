/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, FC } from 'react'
import { useFirebaseAuth } from '../FirebaseAuthContext'
import { auth } from '../firebase/firebaseConfig'
import { useParams, useNavigate } from 'react-router-dom'
import { MdTimer, MdOutlineToday } from 'react-icons/md'
import { GiForkKnifeSpoon } from 'react-icons/gi'
import { addRecipe, getUserRecipes } from '../firebase/firebase'
import { Triangle } from 'react-loader-spinner'
import useAxiosFetch from './useAxiosFetch'
import { IoIosArrowBack } from 'react-icons/io'

interface stepType {
  number: number
  step: string
}

interface extendedIngredientType {
  aisle: string
  amount: number
  consistency: string
  id: number
  image: string
  measures: {
    us: {
      amount: number
      unitLong: string
      unitShort: string
    }
    metric: {
      amount: number
      unitLong: string
      unitShort: string
    }
  }
  meta: [string]
  name: string
  nameClean: string
  original: string
  originalName: string
  unit: string
}

interface analyzedInstructionType {
  name: string
  steps: [stepType]
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
  extendedIngredients: [extendedIngredientType]
  analyzedInstructions: [analyzedInstructionType]
}

interface ingredientType {
  original: string
}

interface errorMessageType {
  errorMessage: string
}

const ifArrayIsNotEmpty = (array: any) => array.length > 0

const RecipePage = () => {
  /* Gets id for the specific recipe from the url */
  const { recipeId } = useParams<string>()
  const user = useFirebaseAuth() || auth.currentUser
  const [recipeSaved, setRecipeSaved] = useState<boolean>(false)
  const [disableSaveButton, setDisableSaveButton] = useState<boolean>(false)
  const navigate = useNavigate()

  const {
    data: recipeData,
    loading,
    error,
    errorMessage
  } = useAxiosFetch(`/.netlify/functions/get-recipe/${recipeId}`)

  useEffect(() => {
    if (user) {
      getUserRecipes(user).then(recipes => {
        const recipe = recipes.filter(
          (recipe: any) => Number(recipe.id) === Number(recipeId)
        )
        if (recipe.length > 0) {
          setDisableSaveButton(true)
        }
      })
    }
  }, [user, recipeId])

  const saveRecipe = async () => {
    if (user && recipeData) {
      await addRecipe(user.uid, {
        id: recipeId as string,
        title: recipeData.title,
        img: recipeData.image
      })
      setRecipeSaved(true)
      setDisableSaveButton(true)
      const timeout = setTimeout(() => {
        setRecipeSaved(false)
        clearTimeout(timeout)
      }, 5000)
    } else {
      navigate('/login', {
        state: { message: `Must be logged in to save ${recipeData?.title}` }
      })
    }
  }

  const RenderErrorMessage: FC<errorMessageType> = ({ errorMessage }) => (
    <div id='message-error'>
      {errorMessage?.includes('404') ? 'Recipe not found' : errorMessage}
    </div>
  )

  const SaveSuccessMessage = () => {
    if (recipeSaved) {
      return (
        <span id='save-success-message'>{recipeData?.title} recipe has been saved</span>
      )
    } else {
      return null
    }
  }

  const RecipeSteps: FC<recipeDataType> = ({ analyzedInstructions }) => {
    const steps = analyzedInstructions[0]?.steps.map((instruction: stepType) => ({
      number: instruction.number,
      step: instruction.step
    }))
    return ifArrayIsNotEmpty(steps) ? (
      <div id='recipe-steps-wrapper'>
        <h3 id='recipe-steps-subheading'>Instructions</h3>
        <ol id='recipe-steps'>
          {steps.map((instruction: stepType) => (
            <li id='recipe-step' className='recipe-list-item' key={instruction?.number}>
              {instruction?.step}
            </li>
          ))}
        </ol>
      </div>
    ) : null
  }

  const RecipeIngredients: FC<recipeDataType> = ({ extendedIngredients }) => {
    const ingredients = extendedIngredients.map((ingredient: ingredientType) => ({
      name: ingredient?.original
    }))
    return ifArrayIsNotEmpty(ingredients) ? (
      <div id='recipe-ingredients-wrapper'>
        <h3 id='recipe-ingredients-subheading'>Ingredients</h3>
        <ul id='recipe-ingredients-list'>
          {ingredients.map((ingredient: { name: string }) => (
            <li
              id='recipe-ingredient'
              className='recipe-list-item'
              key={ingredient?.name}>
              {ingredient?.name}
            </li>
          ))}
        </ul>
      </div>
    ) : null
  }

  const ReturnToRecipes: FC = () => {
    const navigateToHome = () => {
      navigate('/', {state: { loadRecipes: true}})
    }
    return (
      <div id="return-wrapper" onClick={() => navigateToHome()}>
        <IoIosArrowBack id="return-icon" />
        <span id="return-text">Return to Recipes</span>
      </div>
    )
  }

  return (
    <div id='recipe-page'>
      <ReturnToRecipes />
      <SaveSuccessMessage />
      {errorMessage ? <RenderErrorMessage errorMessage={errorMessage} /> : null}
      {loading ? (
        <div id='triangle'>
          <Triangle ariaLabel='loading-indicator' />
        </div>
      ) : null}
      {recipeData && (
        <div id='recipe-info'>
          <div id='recipe-main'>
            <h2 id='recipe-info-title'>{recipeData?.title}</h2>
            <button
              disabled={disableSaveButton}
              id='recipe-save-btn'
              onClick={saveRecipe}>
              {disableSaveButton ? 'Recipe Saved' : 'Save Recipe'}
            </button>
            <img src={recipeData?.image} alt={recipeData?.title} id='recipe-info-image' />
            <div id='recipe-info-cooking'>
              <div id='recipe-info-time-wrapper' className='recipe-data'>
                <MdTimer id='recipe-info-time-icon' />
                <span id='recipe-info-time' className='recipe-data-text'>
                  {recipeData?.readyInMinutes} mins
                </span>
              </div>
              <div id='recipe-info-servings-wrapper' className='recipe-data'>
                <GiForkKnifeSpoon id='recipe-info-servings-icon' />
                <span id='recipe-info-servings' className='recipe-data-text'>
                  {recipeData?.servings}{' '}
                  {recipeData?.servings === 1 ? 'serving' : 'servings'}
                </span>
              </div>
              <div id='recipe-info-dishType-wrapper' className='recipe-data'>
                <MdOutlineToday id='recipe-info-dishType-icon' />
                <span id='recipe-info-dishType' className='recipe-data-text'>
                  {recipeData?.dishType?.slice(0, 1).toUpperCase()}
                  {recipeData?.dishType?.slice(1)}
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
            {recipeData?.extendedIngredients?.length > 0 && (
              <RecipeIngredients {...recipeData} />
            )}
            {recipeData?.analyzedInstructions?.length > 0 && (
              <RecipeSteps {...recipeData} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default RecipePage
