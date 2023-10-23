import { useState, useEffect } from 'react'
import axios from 'axios'

const countriesUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const openWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather'
const weatherIconUrl = 'https://openweathermap.org/img/wn/'

const openWeatherKey = import.meta.env.VITE_OPENWEATHER_KEY

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

      <WeatherDisplay country={country} />
    </div>
  )
}

function WeatherDisplay({ country }) {
  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {
    const url = `${openWeatherUrl}?lat=${country.capitalInfo.latlng[0]}&lon=${country.capitalInfo.latlng[1]}&appid=${openWeatherKey}&units=metric`
    axios.get(url).then((response) => {
      setWeatherData(response.data)
    })
  }, [country])

  if (weatherData === null) {
    return null
  }

  const iconUrl = `${weatherIconUrl}${weatherData.weather[0].icon}@2x.png`

  return (
    <div>
      <h2>Weather in {country.capital}</h2>
      <div>temperature {weatherData.main.temp} Celcius</div>
      <img src={iconUrl} alt={weatherData.weather[0].description}></img>
      <div>wind {weatherData.wind.speed} m/s</div>
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

  const countryDisplay = showCountry ? (
    <CountryDisplay country={country} />
  ) : null
  const buttonText = showCountry ? 'hide' : 'show'

  return (
    <div>
      {country.name.common}{' '}
      <button onClick={toggleShowCountry}>{buttonText}</button>
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
