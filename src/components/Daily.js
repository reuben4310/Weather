// import Table from "react-bootstrap/Table";
import React, { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { logDOM } from "@testing-library/react";
// import holidays from "../holidays";

export default function Daily({
  weather,
  holidays,
  currentDate,
  setCurrentDate,
}) {
  const importAll = (r) => {
    let images = {};
    r.keys().map((item, index) => {
      images[item.replace("./", "")] = r(item);
    });
    return images;
  };

  const images = importAll(
    require.context(
      "../../src/PNG/1st Set - Color",
      false,
      /\.(png|jpe?g|svg)$/
    )

    // src\PNG\1st Set - Monochrome
  );

  const tConvert = (time) => {
    console.log("time", time);
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
  };

  return (
    <>
      <div>
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
        <br /> <br />
        {weather !== undefined &&
          weather &&
          weather.hourly.days.map((day, key) => {
            console.log("backwords", day, weather, weather.hourly.days);
            console.log("day", day);

            return (
              <>
                <span key={key}>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead></TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell
                            style={{
                              width: "30%",
                            }}
                          >
                            {day.datetime}
                            <br />
                            {holidays &&
                              holidays.holidays
                                .map((holiday) => holiday)
                                .filter(
                                  (holiday) => holiday.date.iso === day.datetime
                                )
                                .map((holiday) => (
                                  <>
                                    {" "}
                                    <li>
                                      {holiday.name}
                                      <Tooltip
                                        title={`${holiday.description}     
          Countries with this holiday: ${holiday.locations}`}
                                        placement="right"
                                      >
                                        <InfoIcon color="primary" />
                                      </Tooltip>
                                    </li>
                                  </>
                                ))}
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                            }}
                          >
                            {day.temp} {day.conditions}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {Object.keys(images)
                              .filter((imgKey) => day.icon + ".png" === imgKey)
                              .map((imgKey, key) => (
                                <>
                                  <img
                                    src={images[imgKey]}
                                    id={imgKey}
                                    key={key}
                                    alt="icon"
                                  />
                                </>
                              ))}{" "}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </span>
              </>
            );
          })}
      </div>
    </>
  );
}
