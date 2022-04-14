import { useState ,useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { MdTimer , MdOutlineToday} from 'react-icons/md'
import { GiForkKnifeSpoon } from 'react-icons/gi'

interface stepType {
  number: number
  step: string
}

interface recipeDataType {
  title: string
  summary: string
  servings: number
  dishType: string,
  dairyFree: boolean
  sourceName: string
  sourceUrl: string
  healthScore: number
  readyInMinutes: number
  vegan: boolean
  vegetarian: boolean
  glutenFree: boolean
  image: string
  ingredients: [string]
  steps: [stepType]
}

interface ingredientType {
  original: string 
}


const getRecipeInfo = async (id : string | undefined) => {
  try {
    console.log(id)
    const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=f2998c2dba0c42f1b03c4774b90d04f5`)
    console.log(response)
    return response.data
  } catch (error) {
    console.log(error)
  }
}

const RecipePage = () => {
  /* Gets id for the specific recipe from the url */
  const { id } = useParams()
  const [recipeData, setRecipeData] = useState<recipeDataType>({
    title: '',
    summary: '',
    servings: 0,
    dishType: '',
    dairyFree: false,
    sourceName: '',
    sourceUrl: '',
    healthScore: 0,
    readyInMinutes: 0,
    vegan: false,
    vegetarian: false,
    glutenFree: false,
    image: '',
    ingredients: [''],
    steps: [{ number: 0, step: ''}]
  })
  console.log(recipeData)

  useEffect(() => {
    const loadRecipeInfo = async () => {
      const {
        title, summary, servings, dishTypes, dairyFree, sourceName, sourceUrl, healthScore, readyInMinutes, vegan, vegetarian, glutenFree, image, extendedIngredients, analyzedInstructions
      }  = await getRecipeInfo(id)
      setRecipeData({
        title,
        summary,
        servings,
        dishType: dishTypes[0],
        dairyFree,
        sourceName,
        sourceUrl, 
        healthScore, 
        readyInMinutes,
        vegan,
        vegetarian,
        glutenFree,
        image,
        ingredients: extendedIngredients.map((ingredient : ingredientType) => ingredient.original),
        steps: analyzedInstructions[0].steps.map((instruction : stepType) => ({number: instruction.number, step: instruction.step}))
      })
    }

    loadRecipeInfo()
  }, [id])

  return (
    <div id='recipe-page'>
      <div id="recipe-info">
        <h2 id="recipe-info-title">{recipeData.title}</h2>
        <div id="recipe-info-image-wrapper">
          <img src={recipeData.image} alt={recipeData.title} id="recipe-info-image" />
        </div>
        <div id="recipe-info-cooking">
          <div id="recipe-info-time-wrapper">
            <MdTimer id='recipe-info-time-icon'/>
            <span id="recipe-info-time">{recipeData.readyInMinutes} mins</span>
          </div>
          <div id="recipe-info-servings-wrapper">
            <GiForkKnifeSpoon id="recipe-info-servings-icon" />
            <span id="recipe-info-servings">{recipeData.servings}</span>
          </div>
          <div id="recipe-info-dishType-wrapper">
            <MdOutlineToday id="recipe-info-dishType-icon" />
            <span id="recipe-info-dishType">{recipeData.dishType}</span>
          </div>
        </div>
        <div id="recipe-summary-wrapper">
          <span id="recipe-summary" dangerouslySetInnerHTML={{__html: recipeData.summary}}></span>
        </div>
        <div id="recipe-ingredients-wrapper">
          <h3 id="recipe-ingredients-subheading">Ingredients</h3>
          <ul id="recipe-ingredients-list">
          {
            recipeData.ingredients.map((ingredient : string) => (
                <li id="recipe-ingredient" key={ingredient}>{ingredient}</li>
            ))
          }
          </ul>
        </div>
        <div id="recipe-steps-wrapper">
          <h3 id="recipe-steps-subheading">Instructions</h3>
          <ol id="recipe-steps">
            {
              recipeData.steps.map((instruction: stepType) => (
                <li id="recipe-step" key={instruction.number}>{instruction.step}</li>
              ))
            }
          </ol>
        </div>
      </div>
    </div>
  )
}

export default RecipePage