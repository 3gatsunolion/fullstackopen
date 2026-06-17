import { useState, useEffect } from 'react'
import axios from 'axios'
import Content from './components/Content'

// Only variables prefixed with VITE_ are exposed to Vite.
const api_key = import.meta.env.VITE_WEATHER_API_KEY

function App() {
  const [countries, setCountries] = useState(null)
  // indices that maps to countries
  const [filteredCountries, setFilteredCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
  }, [])

  useEffect(() => {
    if (filteredCountries.length === 1) {
      const country = countries[filteredCountries[0]]
      // Some countries have no capital (i.e. Antarctica, Bouvet Island, etc.)
      const [lat, lng] = country.capital ? country.capitalInfo.latlng : country.latlng
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${api_key}`)
        .then(response => setWeather(response.data))
    }
  }, [filteredCountries])

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
    if (e.target.value === '') {
      setFilteredCountries([])
    } else {
      const target = e.target.value.toLowerCase()
      const filtered = countries.reduce((accum, curr, i) => {
        const include = curr.name.common.toLowerCase().includes(target)
        if (include) accum.push(i)
        return accum
      }, [])
      setFilteredCountries(prev => {
        if (
          prev.length === filtered.length &&
          prev.every((v, i) => v === filtered[i])
        ) {
          return prev // same reference -> React bails out (don't want to have to repeatedly fire weather API call for the same result)
        }
        return filtered
      })
    }
  }

  const showCountry = (index) => setFilteredCountries([index])

  if (countries === null) return null

  return (
    <div>
      <div>
        find countries <input onChange={handleFilterChange} value={filter} />
      </div>
      <Content
        countries={filteredCountries.map(index => ({ ...countries[index], original_index: index }))}
        weather={weather}
        showCountry={showCountry} />
    </div>
  )
}

export default App
