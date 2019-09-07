import React, { useState } from 'react';

export const CustomerForm = ({
  firstName,
  lastName,
  phoneNumber
}) => {
  const [ customer, setCustomer ] = useState({ firstName, lastName, phoneNumber });

  const handleValueChange = field => ({ target }) =>
    setCustomer(customer => ({
      ...customer,
      [field]: target.value
    }));

  const handleSubmit = () => {
    window.fetch('/customers', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer)
    });
  }

  return (
    <form id="customer" onSubmit={handleSubmit}>
      <fieldset>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={firstName}
          onChange={handleValueChange('firstName')}
        />
      </fieldset>
      <fieldset>
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={lastName}
          onChange={handleValueChange('lastName')}
        />
      </fieldset>
      <fieldset>
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          value={phoneNumber}
          onChange={handleValueChange('phoneNumber')}
        />
      </fieldset>
      <button type="submit">Add</button>
    </form>
  )
};
