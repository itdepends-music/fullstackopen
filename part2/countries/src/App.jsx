import { useState, useEffect } from 'react'
import axios from 'axios'

const countriesUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

function CountrySearchInput({ searchText, handleSearchTextChange }) {
  return (
    <div>
      find countries{' '}
      <input value={searchText} onChange={handleSearchTextChange} />
    </div>
  )
}

function CountriesDisplay({ searchText }) {
  const [allCountryData, setAllCountryData] = useState(null)

  useEffect(() => {
    axios.get(countriesUrl).then((response) => {
      setAllCountryData(response.data)
    })
  }, [])

  if (allCountryData === null) {
    return <div>Loading...</div>
  }

  const countriesFiltered = allCountryData.filter((c) =>
    c.name.common.toLowerCase().includes(searchText.toLowerCase()),
  )

  if (countriesFiltered.length > 10) {
    return <div>Too many matches, specify another filter</div>
  } else if (countriesFiltered.length >= 2) {
    return <CountriesNameList countriesFiltered={countriesFiltered} />
  } else if (countriesFiltered.length === 1) {
    return <CountryDisplay country={countriesFiltered[0]} />
  } else {
    return null
  }
}

function CountryDisplay({ country }) {
  return (
    <div>
      <h1>{country.name.common}</h1>

      <div>capital {country.capital[0]}</div>
      <div>area {country.area}</div>

      <h3>langauges:</h3>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img src={country.flags.png} alt={country.flags.alt} />
    </div>
  )
}

function CountriesNameList({ countriesFiltered }) {
  return (
    <div>
      {countriesFiltered.map((country) => (
        <CountryName country={country} key={country.name.common} />
      ))}
    </div>
  )
}

function CountryName({ country }) {
  const [showCountry, setShowCountry] = useState(false)

  const toggleShowCountry = () => {
    setShowCountry(!showCountry)
  }

  const countryDisplay = showCountry ? <CountryDisplay country={country} /> : null
  const buttonText = showCountry ? 'hide' : 'show'

  return (
    <div>
      {country.name.common} <button onClick={toggleShowCountry}>{buttonText}</button>
      {countryDisplay}
    </div>
  )
}

function App() {
  const [searchText, setSearchText] = useState('')

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value)
  }

  return (
    <div>
      <CountrySearchInput
        searchText={searchText}
        handleSearchTextChange={handleSearchTextChange}
      />
      <CountriesDisplay searchText={searchText} />
    </div>
  )
}

export default App
