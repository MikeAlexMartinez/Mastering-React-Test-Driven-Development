import React, { useState } from 'react';

const appointmentTimeOfDay = startsAt => {
  const [h, m] = new Date(startsAt).toTimeString().split(':');
  return `${h}:${m}`;
};

export const Appointment = ({ customer: { firstName, lastName, phoneNumber }, stylist, service, notes, startsAt }) => (
  <table>
    <thead>
      <tr>
        <th colSpan="6">Today's appointment at {appointmentTimeOfDay(startsAt)}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th className="heading">First Name</th>
        <td className="field">{firstName}</td>
      </tr>
      <tr>
        <th className="heading">Last Name</th>
        <td className="field">{lastName}</td>
      </tr>
      <tr>
        <th className="heading">Phone Number</th>
        <td className="field">{phoneNumber}</td>
      </tr>
      <tr>
        <th className="heading">Stylist</th>
        <td className="field">{stylist}</td>
      </tr>
      <tr>
        <th className="heading">Service</th>
        <td className="field">{service}</td>
      </tr>
      <tr>
        <th className="heading">Notes</th>
        <td className="field">{notes}</td>
      </tr>
    </tbody>
  </table>
);

export const AppointmentsDayView = ({ appointments }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(0);

  return (
    <div id="appointmentsDayView" className="appointments-container">
      <ol className="appointments-list">
        {appointments.map((appointment, i) => (
          <li key={appointment.startsAt}>
            <button type="button" onClick={() => setSelectedAppointment(i)}>
              {appointmentTimeOfDay(appointment.startsAt)}
            </button>
          </li>
        ))}
      </ol>
      {appointments.length === 0 ? (
        <p>There are no appointments scheduled for today.</p>
      ) : (
        <Appointment {...appointments[selectedAppointment]} />
      )}
    </div>
  );
};
