import "./WeatherDetails.css";
import "./App.css";
import React, { useEffect, useState } from "react";
import Details from "./components/WeatherDetails";
import { TextField, Button, Card, CardContent } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify/dist/react-toastify";
import { ToastContainer } from "react-toastify/dist/react-toastify";
import "react-toastify/dist/ReactToastify.css";

const style = {
  "& label.Mui-focused": {
    color: "green",
  },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: "rgb(128,0,0)",
    },
  },
};
const date = new Date();

const day = date.getDate();
const month = date.getMonth() + 1;
const year = date.getFullYear();

function App() {
  const [weather, setWeather] = useState("");
  const [city, setCity] = useState("");
  const [show, setShow] = useState("");
  const [newShow, setNewShow] = useState("");
  const [holidays, setHolidays] = useState("");
  const [currentDate, setCurrentDate] = useState(
    date.toISOString().split("T")[0]
  );
  console.log(date.toISOString().split("T")[0]);

  const getWeatherInfo = (e) => {
    e.preventDefault();

    const units = "imperial";

    // USE YOUR OWN API KEY - REGISTER AT https://home.openweathermap.org/users/sign_up
    const APIKey = "e41b9bd72d888b5f53280897fbe53b23";

    fetch(
      `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=HUPvlAra2l0ibCupJfsItjlGKq8OapdX&q=${city}`
    )
      .then((r) => {
        if (!r.ok) {
          throw new Error(`${r.status} ${r.statusText}`);
        }
        return r.json();
      })
      .then((weatherData0) => {
        console.log("0", weatherData0);

        setCity("");

        //axios didn't work for this API
        try {
          fetch(
            `http://api.openweathermap.org/data/2.5/weather?appid=${APIKey}&zip=${weatherData0[0].PrimaryPostalCode}&units=${units}`
          )
            .then((r) => {
              if (!r.ok) {
                throw new Error(`${r.status} ${r.statusText}`);
              }
              return r.json();
            })

            .then((weatherData1) => {
              console.log("1", weatherData1);

              // axios
              //   .get(
              //     `https://api.weatherbit.io/v2.0/current?lat=${weatherData1.coord.lat}&lon=${weatherData1.coord.lon}&key=7f84330bfaf34b8195d028dff27c6f08`
              //   )
              //   .then((weatherData2) => {
              //     console.log(weatherData2.data.data[0]);

              fetch(
                `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${weatherData0[0].PrimaryPostalCode}?unitGroup=us&key=XVZNMNJ7QTTQ8KRGPDFKXKAWL&contentType=json`
              )
                .then((r) => {
                  if (!r.ok) {
                    throw new Error(`${r.status} ${r.statusText}`);
                  }
                  return r.json();
                })
                .then((weatherDataHourly) => {
                  console.log("Hourly", weatherDataHourly);
                  console.log(
                    "HourlyD",
                    weatherDataHourly.days.map((day) => day)
                  );
                  fetch(
                    `https://calendarific.com/api/v2/holidays?&api_key=b39a3156bc455625afcf61d6ff6fbef6982ce8ea&country=${weatherData0[0].Country.ID}&year=${year}`
                  )
                    .then((r) => {
                      if (!r.ok) {
                        throw new Error(`${r.status} ${r.statusText}`);
                      }
                      return r.json();
                    })

                    .then(
                      (fetchData) => {
                        console.log(
                          fetchData.response,
                          "fer",
                          fetchData,
                          "fda",
                          fetchData.response.holidays,
                          "fdres",
                          fetchData.response.holidays[0],
                          "hol",
                          fetchData.response.holidays.map((hol) => hol.name),
                          "hold",
                          fetchData.response.holidays.map((hol) => hol.date.iso)
                        );
                        console.log(
                          "daaaaaaaaaaa",
                          fetchData.response.holidays.map((hol) => {
                            return hol.date.datetime;
                          })
                        );
                        setHolidays(fetchData.response);
                        console.log("holidayssss", holidays);
                      },

                      setWeather({
                        name: weatherData1.name,
                        state: weatherData0[0].AdministrativeArea.ID,
                        imgSrc: `http://openweathermap.org/img/wn/${weatherData1.weather[0].icon}.png`,
                        description: `${weatherData1.main.temp} and ${weatherData1.weather[0].description}`,
                        hourly: weatherDataHourly,
                      })
                    );
                });
            });
          // });
        } catch (err) {
          console.error(err);
          setWeather({ error: "Not found" });
          toast.error("Not found");
        }
      });
  };

  const handleChange = (e) => {
    e.preventDefault();
    setCity(e.target.value);
  };

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.key === "Enter") {
      getWeatherInfo(e);
    }
  };

  return (
    <>
      <ToastContainer autoClose={50000} />
      <h3>Please enter a city or zip code below</h3>
      <h6>
        Please note, if there are more than one city with the same name. Please
        enter the state as well
      </h6>
      <br />
      <div className="container">
        <TextField
          variant="outlined"
          required
          sx={style}
          value={city}
          // name="zipInput"
          placeholder="Zip Code"
          type="zipInput"
          // id="zipInput"
          onChange={handleChange}
          onKeyPress={handleKeypress}
        />
        <br />
        <br />
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => {
            getWeatherInfo(e);
          }}
        >
          Enter
        </Button>{" "}
        {weather ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              window.location.reload();
            }}
          >
            Go Back
          </Button>
        ) : (
          ""
        )}
        <br />
        <br />
        {weather && weather !== undefined ? (
          <>
            <Card
             className="size"
              sx={{ width: "75%" }}
              style={{
                textAlign: "center",
                margin: "auto",
                height: "25%",
                marginTop: 8,
              }}
            >
              <CardContent>
                <>
                  <Details
                    weather={weather}
                    show={show}
                    setShow={setShow}
                    newShow={newShow}
                    setNewShow={setNewShow}
                    holidays={holidays}
                    setHolidays={setHolidays}
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                  />
                </>
              </CardContent>
            </Card>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
export default App;
