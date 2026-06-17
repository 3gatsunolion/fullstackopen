import Country from './Country'

const Content = ({ countries, weather, showCountry }) => {
  if (countries.length === 0) {
    return null
  } else if (countries.length === 1) {
    return <Country country={countries[0]} weather={weather} />
  } else if (countries.length > 10) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  } else {
    return (
      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
        {countries.map(c => (
          <li key={c.name.official}>
            {c.name.common} <button onClick={() => showCountry(c.original_index)}>Show</button>
          </li>
        ))}
      </ul>
    )
  }
}

export default Content
