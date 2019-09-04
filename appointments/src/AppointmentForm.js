import React, { useState, useCallback } from 'react';

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

const mergeDateAndTime = (date, timeSlot) => {
  const time = new Date(timeSlot);
  return new Date(date).setHours(
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds()
  );
};

const RadioButtonIfAvailable = ({
  availableTimeSlots,
  date,
  timeSlot,
  checkedTimeSlot,
  handleTimeSlotChange
}) => {
  const startsAt = mergeDateAndTime(date, timeSlot);
  if (availableTimeSlots.some(availableTimeSlot =>
    availableTimeSlot.startsAt === mergeDateAndTime(date, timeSlot)
  )) {
    const isChecked = startsAt === checkedTimeSlot;
    return (
      <input
        name="startsAt"
        type="radio"
        value={startsAt}
        checked={isChecked}
        onChange={handleTimeSlotChange}
      />
    );
  }
  return null;
}

export const TimeSlotTable = ({
  salonOpensAt,
  salonClosesAt,
  today,
  availableTimeSlots,
  handleTimeSlotChange,
  checkedTimeSlot
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
            {dates.map(date => (
              <td key={date}>
                <RadioButtonIfAvailable
                  availableTimeSlots={availableTimeSlots}
                  date={date}
                  timeSlot={timeSlot}
                  checkedTimeSlot={checkedTimeSlot}
                  handleTimeSlotChange={handleTimeSlotChange}
                />
              </td>
            ))}
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
  availableTimeSlots,
  startsAt,
  onSubmit
}) => {
  const [state, setAppointment] = useState({ service, startsAt });

  const handleServiceChange = ({ target }) =>
    setAppointment(state => ({
      ...state,
      service: target.value
    }));

  const handleTimeSlotChange = useCallback(
    ({ target: { value }}) =>
      setAppointment(state => ({
        ...state,
        startsAt: parseInt(value)
      })),
      []
    );

  return (
    <form id="appointment" onSubmit={() => onSubmit(state)}>
      <fieldset>
        <label htmlFor="service">Select A Service</label>
        <select
          name="service"
          id="service"
          value={state.service}
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
          availableTimeSlots={availableTimeSlots}
          checkedTimeSlot={state.startsAt}
          handleTimeSlotChange={handleTimeSlotChange}
        />
      </fieldset>
      <button type="submit">Add</button>
    </form>
  );
}

AppointmentForm.defaultProps = {
  availableTimeSlots: [],
  salonOpensAt: 9,
  salonClosesAt: 19,
  today: new Date(),
}
