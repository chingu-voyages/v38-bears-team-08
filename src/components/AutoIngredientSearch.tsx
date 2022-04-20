/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, useCallback, SyntheticEvent, FC } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import ingredientOptions from '../data/ingredientOptions'
import './styles.css'
import { Triangle } from 'react-loader-spinner'

type optionType = {
  label: string
  value: string
  id: number
}
type ingredientType = {
  name: string
  id: number
}

interface AutoIngredientSearchProps {
  setIngredients: (recipes: string[]) => void
}
interface recipeType {
  id: number
  title: string
  image: string
}
interface RecipiesViewProps {
  recipes: recipeType[]
}

const autoComplete = (ingredient: string) => {
  const matchingIngredients = ingredientOptions.filter(
    (ingredientOption: ingredientType) =>
      ingredient === ingredientOption.name.slice(0, ingredient.length)
  )
  return matchingIngredients.slice(0, 10)
}

/**
 *
 *  This component is to add/create a list of ingridients
 */
const AutoIngredientSearch: FC<AutoIngredientSearchProps> = ({ setIngredients }) => {
  const [ingredient, setIngredient] = useState('')
  const [ingredientsList, setIngridientsList] = useState<string[]>([])
  const [options, setOptions] = useState<optionType[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRecipies = async () => {
      try {
        const matchingIngredients = autoComplete(ingredient)

        const opts = matchingIngredients.map((item: ingredientType) => ({
          label: item.name,
          value: item.name,
          id: item.id
        }))
        setOptions(opts)

        setError('')
      } catch (err) {
        setError('Error: No recipes found')
      }
    }
    if (ingredient) {
      fetchRecipies()
    }
  }, [ingredient])

  useEffect(() => {
    setIngredients([...ingredientsList])
  }, [ingredientsList, setIngredients])

  const removeIngredientFromList = (event: SyntheticEvent) => {
    const element = event.currentTarget as HTMLInputElement
    const itemToRemove = element.parentElement?.innerText.split(' ')[0]
    setIngridientsList(ingredientsList.filter(item => item !== itemToRemove))
  }

  const ingredientIsEmpty = ingredient.trim().length === 0
  const ingredientsListDoesNotContainIngredient = !ingredientsList.includes(ingredient)
  const ingredientExists = ingredient

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (ingredientIsEmpty) {
      setError('Error: cannot be empty')
      return void 0
    }

    if (ingredientExists && ingredientsListDoesNotContainIngredient) {
      setIngridientsList([...ingredientsList, ingredient])
      setIngredient('')
    } else {
      setError('Error: Ingredient already in the list')
    }
  }

  const handleChange = (e: SyntheticEvent): void => {
    const element = e.currentTarget as HTMLInputElement
    setIngredient(element.value)
  }

  return (
    <>
      <div id='ingredient-search'>
        <div id='ingredients-tags'>
          {ingredientsList.length > 0 &&
            ingredientsList.map(ingredient => (
              <span className='ingredient-tags-item' key={ingredient}>
                {ingredient}{' '}
                <button
                  className='x-btn'
                  onClick={e => removeIngredientFromList(e)}
                  title='Remove ingredient'>
                  x
                </button>
              </span>
            ))}
        </div>
        <form id='ingredient-form' onSubmit={handleSubmit}>
          <input
            autoFocus
            id='ingredients'
            list='ingredients-list'
            value={ingredient}
            onChange={handleChange}
            placeholder={error.length > 0 ? error : 'e.g chicken'}
          />
          <label htmlFor='ingredients'>Enter ingredients</label>
          <datalist id='ingredients-list'>
            {options
              ? options.map((item: optionType) => (
                  <option key={item.id} value={item.value} />
                ))
              : null}
          </datalist>
          <button className='btn-primary' type='submit' title='Add ingredient'>
            Add ingredient
          </button>
        </form>
      </div>
    </>
  )
}

const RecipiesView: FC<RecipiesViewProps> = ({ recipes }) => {
  const [shownRecipes, setShownRecipes] = useState<recipeType[]>(recipes.slice(0, 16))
  const [page, setPage] = useState<number>(1)

  const observer = useRef<IntersectionObserver>()
  const lastRecipeRef = useCallback(node => {
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(page => page + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [])

  useEffect(() => {
    const loadNewRecipes = () => {
      if (page !== 1) {
        const newRecipesTimeout = setTimeout(() => {
          setShownRecipes(recipes.slice(0, 16 * page))
          clearTimeout(newRecipesTimeout)
        }, 500)
      }
    }
    loadNewRecipes()
  }, [page, recipes])

  useEffect(() => {
    /* Resets infinite scroll when a new recipes are loaded */
    const resetPages = () => {
      if (shownRecipes.length === recipes.length) {
        setPage(1)
      }
    }
    resetPages()
  }, [page, recipes, shownRecipes.length])

  return (
    <div id='recipes-grid'>
      {shownRecipes.map((recipe: recipeType, index: number) => (
        <Link key={recipe.id} to={`${recipe.id}`} id='recipe-link'>
          <div ref={shownRecipes.length - 1 === index ? lastRecipeRef : null} id='recipe'>
            <img id='recipe-image' src={recipe.image} alt={recipe.title} />
            <span id='recipe-title'>
              {recipe.title.length >= 40
                ? `${recipe.title.slice(0, 40)}...`
                : recipe.title}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default function GetRecipies() {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [recipes, setRecipies] = useState<recipeType[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState<boolean>(false)

  const location = useLocation()
  console.log('location', location)

  const handleClick = async () => {
    if (ingredients.length > 0) {
      try {
        const url = `/.netlify/functions/get-recipes?ingredients=${ingredients}`
        setRecipies([])
        setLoading(true)
        const response = await axios.get(url)
        setLoading(false)
        setRecipies(response.data)
        sessionStorage.setItem('recipes', JSON.stringify(response.data))
        sessionStorage.setItem('pageKey', location.key)
        setError('')
      } catch (err) {
        setLoading(false)
        setError('Error: No recipes found')
      }
    } else {
      setError('Error: No ingredients entered')
    }
  }

  useEffect(() => {
    const getRecipesFromStorage = () => {
      const storedRecipesCheck = sessionStorage.getItem('recipes')
      const pageKey = sessionStorage.getItem('pageKey')
      if (storedRecipesCheck && location.key === pageKey) {
        const storedRecipes = JSON.parse(storedRecipesCheck)
        setRecipies(storedRecipes)
      }
    }
    getRecipesFromStorage()
  }, [])
  // TODO: Imporve error msg
  return (
    <>
      <div id='search-component'>
        <AutoIngredientSearch setIngredients={setIngredients} />
        <button
          className='btn-primary'
          onClick={handleClick}
          type='submit'
          title='Get recipes'>
          Get Recipes
        </button>
        {error && <p className='error-msg'>{error}</p>}
      </div>
      {loading ? (
        <div id='triangle'>
          <Triangle ariaLabel='loading-indicator' />
        </div>
      ) : null}
      {recipes.length > 0 ? <RecipiesView recipes={recipes} /> : null}
    </>
  )
}
