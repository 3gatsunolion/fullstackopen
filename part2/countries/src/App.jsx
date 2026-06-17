import { useState, useEffect } from 'react'
import axios from 'axios'
import Content from './components/Content'

function App() {
  const [countries, setCountries] = useState(null)
  // indices that maps to countries
  const [filteredCountries, setFilteredCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
  }, [])

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
      setFilteredCountries(filtered)
      // setFilteredCountries(prev => {
      //   if (
      //     prev.length === filtered.length &&
      //     prev.every((v, i) => v === filtered[i])
      //   ) {
      //     return prev // same reference -> React bails out (don't want to have to repeatedly fire weather API call for the same result)
      //   }
      //   return filtered
      // })
    }
  }

  const showCountry = (index) => {
    setFilter(countries[index].name.common)
    setFilteredCountries([index])
  }

  if (countries === null) {
    return (<div>Loading country data...</div>)
  }

  return (
    <div>
      <div>
        find countries <input onChange={handleFilterChange} value={filter} />
      </div>
      <Content
        countries={filteredCountries.map(index => ({ ...countries[index], original_index: index }))}
        showCountry={showCountry} />
    </div>
  )
}

export default App
