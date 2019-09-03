import React, { useState } from 'react';

export const AppointmentForm = ({ selectableServices, service, onSubmit }) => {
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
    </form>
  );
}