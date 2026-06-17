import { useState, useEffect } from 'react'
import axios from 'axios'
import React from 'react';

// Only variables prefixed with VITE_ are exposed to Vite.
const api_key = import.meta.env.VITE_WEATHER_API_KEY

const isSameCountry = ({ country: prevCountry }, { country: nextCountry }) => {
  return prevCountry.name.common === nextCountry.name.common
}

const Weather = React.memo(({ country }) => {
  const [data, setData] = useState(null)

  useEffect(() => {
    // Some countries have no capital (i.e. Antarctica, Bouvet Island, etc.)
    const [lat, lng] = country.capital ? country.capitalInfo.latlng : country.latlng
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${api_key}`)
      .then(response => setData(response.data))
  }, [country])

  if (!data) return null

  const location = country.capital ? country.capital[0] : country.name.common
  return (
    <div>
      <h2>Weather in {location}</h2>
      <div>Temperature {data.main.temp} Celsius</div>
      <img src={`https://openweathermap.org/payload/api/media/file/${data.weather[0].icon}.png`} alt={data.weather[0].description} />
      <div>Wind {data.wind.speed} m/s</div>
    </div>
  )
}, isSameCountry)

export default Weather
