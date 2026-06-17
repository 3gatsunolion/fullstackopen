import Weather from './Weather'

const Country = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      {country.capital && <div>Capital {country.capital[0]}</div>}
      <div>Area {country.area}</div>
      <h2>Languages</h2>
      {/* i.e. Antarctica has no official language */}
      {!country.languages ? [<div key="no-language">No official language(s)</div>, <br key="break" />] :
      <ul>
        {Object.entries(country.languages).map(([key, lng]) => <li key={key}>{lng}</li>)}
      </ul>}
      <img src={country.flags.png} alt={country.flags.alt} />
      <Weather country={country} />
    </div>
  )
}

export default Country
