import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!

const Calendar = () => {
  return (
    <div className="calendar">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={[
          { title: "Algorithms tutoring", date: "2024-02-01" },
          { title: "Behavioral interview", date: "2024-02-04" },
        ]}
      />
    </div>
  );
};

export default Calendar;
