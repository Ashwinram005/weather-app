import { useEffect, useState } from "react"
import PropTypes from "prop-types";
const WeatherDetails=({icon,icondesc,temp,city,country,lat,lon,humidity,wind})=>{
  return(
    <div>
      <div className="icon">
        <img src={icon} alt="weathericon"/>
      </div>
      <div className="icondesc">{icondesc}</div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="coordinates">
        <div>
          <span className="lat">Latitude</span>
          <span>{lat}</span>
        </div>
        <div> 
          <span className="lon">Longitude</span>
          <span>{lon}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="humidity">
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="wind">
          <div className="data">
            <div className="wind-percent">{wind}km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const App = () => {
  
  let apikey="ddc859b72a17051948eb6b25c9f40882";
  const [inputtext,setInputtext]=useState("Madurai");
  const [icon,setIcon]=useState("https://openweathermap.org/img/wn/10d@2x.png");
  const [icondesc,setIcondesc]=useState("");
  const [temp,setTemp]=useState(0);
  const [city,setCity]=useState("Madurai");
  const [country,setCountry]=useState("IN");
  const [lat,setLatitude]=useState(0);
  const [lon,setLongitude]=useState(0);
  const [humidity,sethumidity]=useState(0);
  const [wind,setWind]=useState(0);
  const [citynotfound,setCitynotfound]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);

  const search=async()=>{
    setLoading(true);
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${inputtext}&appid=${apikey}&units=Metric`;
    try{
      let res=await fetch(url);   
      let data=await res.json(); 
      console.log(data);
      if(data.cod==="404"){
        console.error("City not found");
        setCitynotfound(true);
        setError(null);
        setLoading(false);
        return
      }
      else{
        setTemp(Math.floor(data.main.temp));
        setCity(data.name);
        setCountry(data.sys.country)
        setLatitude(data.coord.lat)
        setLongitude(data.coord.lon)
        sethumidity(data.main.humidity);
        setWind(data.wind.speed);
        setIcon(`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
        setIcondesc(data.weather[0].description)
        setError(null);
        setCitynotfound(false)
      }
    }
    catch(error){
      console.error("An error occured: "+error.message);
      setCitynotfound(true);
      setError("An error occured while fetching weather data");
    }
    finally{
      setLoading(false);
    }
  }

  const handletext=(e)=>{
    setInputtext(e.target.value)
  }

  const handlekeydown=(e)=>{
    if(e.key==="Enter")
        search();
  }
  
  useEffect(()=>{
    search();
  },[]);
  
  return (
    <div className='app-container'>
          <div className='input-container'>
            <input type="text" className='location-input'placeholder='Enter new Location' value={inputtext} onChange={handletext} onKeyDown={handlekeydown}/>
            <button className='search' onClick={search}>Search</button>
          </div>
          {!citynotfound&&!loading&&<WeatherDetails icon={icon} icondesc={icondesc} temp={temp} city={city} country={country}  lat={lat} lon={lon} humidity={humidity} wind={wind}/>}
          {loading&&<div className="loading-message">Loading...</div>}
          {error&&<div className="error-message">{error}</div>}
          {error==null&&citynotfound&&<div className="city-not-found">City not found</div>}
      </div>
    )
}
WeatherDetails.propTypes={
  icon:PropTypes.string.isRequired,
  icondesc:PropTypes.string.isRequired,
  temp:PropTypes.number.isRequired,
  city:PropTypes.string.isRequired,
  country:PropTypes.string.isRequired,
  lat:PropTypes.number.isRequired,
  lon:PropTypes.number.isRequired,
  humidity:PropTypes.number.isRequired,
  wind:PropTypes.number.isRequired
}