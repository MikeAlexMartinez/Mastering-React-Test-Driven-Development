import React, { useState } from 'react';

const toTimeValue = timestamp => new Date(timestamp).toTimeString().substring(0, 5);

const dailyTimeSlots = (salonOpensAt, salonClosesAt) => {
  const totalSlots = (salonClosesAt - salonOpensAt) * 2;
  const startTime = new Date().setHours(salonOpensAt, 0, 0, 0);
  const increment = 30 * 60 * 1000; // half an hour
  return Array(totalSlots)
    .fill([startTime])
    .reduce((acc, curr, i) => acc.concat([startTime + (i * increment)]));
};

const weeklyDateValues = (startDate) => {
  const midnight = new Date(startDate).setHours(0, 0, 0, 0);
  const increment = 24 * 60 * 60 * 1000;
  return Array(7)
    .fill([midnight])
    .reduce((a, c, i) => a.concat([midnight + (i * increment)]));
}

const toShortDate = timestamp => {
  const [day, _, dayOfMonth] = new Date(timestamp).toDateString().split(' ');
  return `${day} ${dayOfMonth}`;
}

export const TimeSlotTable = ({
  salonOpensAt,
  salonClosesAt,
  today
}) => {
  const timeSlots = dailyTimeSlots(salonOpensAt, salonClosesAt);
  const dates = weeklyDateValues(today);
  return (
    <table id="time-slots">
      <thead>
        <tr>
          <th />
          {dates.map(d => (
            <th key={d}>{toShortDate(d)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {timeSlots.map(timeSlot => (
          <tr key={timeSlot}>
            <th>{toTimeValue(timeSlot)}</th>
          </tr>
        ))}
      </tbody>
    </table>
  )
};

export const AppointmentForm = ({
  selectableServices,
  service,
  salonOpensAt,
  salonClosesAt,
  today,
  onSubmit
}) => {
  const [state, setService] = useState({ service });

  const handleServiceChange = ({ target }) =>
    setService(state => ({
      ...state,
      service: target.value
    }));

  return (
    <form id="appointment" onSubmit={() => onSubmit(state)}>
      <fieldset>
        <label htmlFor="service">Select A Service</label>
        <select
          name="service"
          id="service"
          value={service}
          onChange={handleServiceChange}
        >
          <option />
          {selectableServices && selectableServices.map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </fieldset>
      <fieldset>
        <TimeSlotTable
          today={today}
          salonOpensAt={salonOpensAt}
          salonClosesAt={salonClosesAt}
        />
      </fieldset>
    </form>
  );
}

AppointmentForm.defaultProps = {
  salonOpensAt: 9,
  salonClosesAt: 19,
  today: new Date(),
}
