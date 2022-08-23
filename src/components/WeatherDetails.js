import React from "react";
import Button from "@mui/material/Button";
import InfoIcon from "@mui/icons-material/Info";
import Hourly from "./Hourly";
import Daily from "./Daily";
import { Box, Grid } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

import "../../src/App.css";

const date = new Date();
console.log(
  date.toLocaleTimeString([], {
    month: "2-digit",
    day: "2-digit",
  })
);

export default function Details({
  weather,
  show,
  setShow,
  newShow,
  setNewShow,
  holidays,
  setHolidays,
  currentDate,
  setCurrentDate,
}) {
  console.log(holidays);
  return (
    <>
      <>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2} style={{ justifyContent: "center" }}>
            <Grid item xs={4} md={1}>
              <div
                onClick={() => {
                  setShow((currentShow) => !currentShow);
                  setNewShow("");
                }}
              >
                <Button variant="contained">{show ? "Now" : "Hourly"}</Button>
              </div>
            </Grid>
            <Grid item xs={4} sm={3} lg={2} xl={1}>
              <div
                onClick={() => {
                  setNewShow((currentNewShow) => !currentNewShow);
                  setShow("");
                }}
              >
                <Button variant="contained">{newShow ? "Now" : "Daily"}</Button>
              </div>
            </Grid>
            <Grid item xs={12}>
              {show && (
                <Hourly
                  weather={weather}
                  date={date}
                  holidays={holidays}
                  currentDate={currentDate}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              {newShow && (
                <Daily
                  weather={weather}
                  date={date}
                  holidays={holidays}
                  setHolidays={setHolidays}
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      </>
      {show || newShow ? (
        <>
          <br />
          <h4>Current Weather</h4>
        </>
      ) : (
        ""
      )}
      {date.toLocaleTimeString([], {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}
      <br />
      {/* Holiday map */}
      {holidays &&
        holidays.holidays
          .map((holiday) => holiday)
          .filter((holiday) => holiday.date.iso === currentDate)
          .map((holiday) => holiday.name)}
      {/* Tooltip map */}
      {holidays &&
        holidays.holidays
          .map((holiday) => holiday)
          .filter((holiday) => holiday.date.iso === currentDate)
          .map((holiday) => (
            <Tooltip
              title={`${holiday.description}     
          Countries with this holiday: ${holiday.locations}`}
              placement="right"
            >
              <InfoIcon color="primary" />
            </Tooltip>
          ))}

      {weather !== undefined && weather && (
        <>
          <h1>
            {weather.name} {weather.state}
          </h1>
          <h2>{weather.description}</h2>
          <img src={weather.imgSrc} alt="icon" />
        </>
      )}
    </>
  );
}
