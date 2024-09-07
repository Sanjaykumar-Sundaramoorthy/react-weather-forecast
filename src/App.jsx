import { useEffect, useState } from 'react'
import PropTypes from "prop-types"
import './App.css'

import searchIcon from './assets/search.png'
import clearIcon from './assets/clear.png'
import drizzleIcon from './assets/drizzle.png'
import cloudIcon from './assets/cloud.png'
import humidityIcon from './assets/humidity.png'
import rainIcon from './assets/rain.png'
import snowyIcon from './assets/snowy.png'
import windIcon from './assets/wind.png'

const WeatherDetails = ({icon, temp, city, country, lat, long, humidity, wind}) => {
  return(<>
    <div className='image'>  
      <img src={icon} alt={icon}/>
    </div>
    <div className='temp'>{temp}°C</div>
    <div className="location">{city}</div>
    <div className="country">{country}</div>
    <div className="cord">
      <div className="cord-item">
        <span className='lat'>Latitude</span>
        <span>{lat}</span>
      </div>
      <div className="cord-item">
        <span className='long'>Longitude</span>
        <span>{long}</span>
      </div>
    </div>
    <div className="data-container">
      <div className="element">
        <img src={humidityIcon} alt="humidity"className='icon' />
        <div className='data'>
          <div className='humidity-percent'>{humidity} %</div>
          <div className='text'>Humidity</div>
        </div>
      </div>
      <div className="element">
        <img src={windIcon} alt="windy" className='icon' />
        <div className='data'>
          <div className='wind-percent'>{wind} km/h</div>
          <div className='text'>Wind Speed</div>
        </div>
      </div>
    </div>
    
  </>);
}

WeatherDetails.propTypes = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  humidity: PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  long: PropTypes.number.isRequired,
}

function App() {

  let api_key = "730159e55a0cf1fdc68bdacd17deda17";

  const [icon, setIcon] = useState(snowyIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [text, setText] = useState("London");
  const [loading, setLoading] = useState(false);
  const [cityNotFound, setCityNotFound] = useState(false);
  let [error, setError] = useState(null);

  const weatherIconmap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowyIcon,
    "13n": snowyIcon,
  };

  const search = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try{
     let res = await fetch(url);
     let data = await res.json();

     if(data.cod == "404"){
      console.log("city not found");
      setCityNotFound(true);
      setLoading(false);
      return
     }

     setHumidity(data.main.humidity);
     setWind(data.wind.speed);
     setTemp(Math.floor(data.main.temp));
     setCity(data.name);
     setCountry(data.sys.country);
     setLat(data.coord.lat);
     setLong(data.coord.lon);
     const weatherIconCode = data.weather[0].icon;
     setIcon(weatherIconmap[weatherIconCode] || clearIcon);
     setCityNotFound(false);
    }catch(error){
      console.log("An error occurred : ", error.message);
      setError("An error occurred while fetching the city data");
    }finally{
      setLoading(false);
    }
  }

  const handleCity = (e) => {
    setText(e.target.value)
  }

  const handleKeyDown = (e) => {
    if(e.key == "Enter") {
      search();
    }
  }

  useEffect(function() {
    search();
  },[]);

  return (
    <>
    <div className='full-container'>

    <div className='left-container'>
      <h1>
         <span>Climate Change</span> <br /><span>Weather Forecast</span> 
      </h1>
        <div className='input-container'>
          <input type="text" className='cityInput' placeholder='Search City' onChange={handleCity} value={text} onKeyDown={handleKeyDown}/>
          <div className='search-icon' onClick={() => search()}>
            <img src={searchIcon} alt="Search" width={28} height={28}/>
          </div>
        </div>
    </div>
      <div className='container'>

        {loading && <div className='loading-message'>loading...</div>}
        {error && cityNotFound &&<div className='error-message'>{error}</div>}
        {cityNotFound && <div className='city-not-found'>city not found</div>}

        {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} long={long} humidity={humidity} wind={wind} />}        <p className='copyright'>
          Designed by <a href="https://www.linkedin.com/in/sanjaykumar-21csr092/" target='blank'>Sanjaykumar</a>
        </p>
      </div>
    </div>
    </>
  );
}

export default App
