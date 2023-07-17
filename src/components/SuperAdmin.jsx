import React from "react";
import { useState } from "react";
import { Calendar } from "primereact/calendar";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";

const SuperAdmin = () => {
  const [date, setDate] = useState();
  console.log("date", date);
  return (
    <>
      <p>test iranje ss</p>
      <Calendar
        value={date}
        onChange={(e) => setDate(e.value)}
        inline
        showWeek
      />
    </>
  );
};

export default SuperAdmin;
