// import Table from "react-bootstrap/Table";
import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

export default function Hourly({ weather, date, holidays, currentDate }) {
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
        {date.toLocaleTimeString([], {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
        <br />
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
        <br />
        <br />
        {weather !== undefined &&
          weather &&
          weather.hourly.days[0].hours.map((hour, key) => {
            return (
              <>
                <span key={key}>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: "75%" }} aria-label="simple table">
                      <TableHead></TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            {tConvert(hour.datetime.replace(":00", ""))}
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                            }}
                          >
                            {hour.temp} {hour.conditions}
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            {Object.keys(images)
                              .filter((imgKey) => hour.icon + ".png" === imgKey)
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
