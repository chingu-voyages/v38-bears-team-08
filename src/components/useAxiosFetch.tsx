import { useState, useEffect } from 'react'
import axios, { AxiosResponse } from 'axios'

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

interface useAxiosFetchResponseType {
  data: recipeDataType | null
  loading: boolean
  error: boolean
  errorMessage: string | null
}

const useAxiosFetch = (url: string, timeout?: number): useAxiosFetchResponseType => {
  const [data, setData] = useState<recipeDataType | null>(null)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unmounted = false
    let source = axios.CancelToken.source()
    axios
      .get(url, {
        cancelToken: source.token,
        timeout: timeout
      })
      .then(a => {
        if (!unmounted) {
          // @ts-ignore
          setData(a.data)
          setLoading(false)
        }
      })
      .catch(function (error) {
        if (!unmounted) {
          setError(true)
          setErrorMessage(error.message)
          setLoading(false)
          console.log('error in axiosFetch', error)
          if (axios.isCancel(error)) {
            console.log(`request cancelled:${error.message}`)
          } else {
            console.log('another error happened:' + error.message)
          }
        }
      })

    return function () {
      unmounted = true
      source.cancel('Cancelling in cleanup')
      console.log('cancelled')
    }
  }, [url, timeout])

  return { data, loading, error, errorMessage }
}

export default useAxiosFetch
