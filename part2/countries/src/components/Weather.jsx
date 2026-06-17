const Weather = ({ location, data }) => {
  return (
    <div>
      <h2>Weather in {location}</h2>
      <div>Temperature {data.main.temp} Celsius</div>
      <img src={`https://openweathermap.org/payload/api/media/file/${data.weather[0].icon}.png`} alt={data.weather[0].description} />
      <div>Wind {data.wind.speed} m/s</div>
    </div>
  )
}

export default Weather
