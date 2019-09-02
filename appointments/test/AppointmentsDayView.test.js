import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';

import {
  Appointment,
  AppointmentsDayView
} from '../src/AppointmentsDayView';

describe('Appointment', () => {
  let container;
  let customer = {
    firstName: 'Ashley',
    lastName: 'Mildred',
    phoneNumber: '+01234567890'
  };
  let stylist = 'kim';
  let service = 'Blow-dry';
  let notes = 'Some notes';
  let startsAt = new Date().setHours(11, 0);

  beforeEach(() => {
    container = document.createElement('div');
  });

  const render = component => ReactDOM.render(component, container);

  it('renders appointment in a table element', () => {
    render(<Appointment customer={customer} />);
    expect(container.querySelector('table')).not.toBeNull();
    expect(container.querySelector('table').children).toHaveLength(2);
  });

  it('renders a table header with appointment time', () => {
    render(<Appointment customer={customer} startsAt={startsAt} />);
    const header = container.querySelector('thead');
    expect(header).not.toBeNull();
    expect(header.textContent).toBe('Today\'s appointment at 11:00');
  });

  it('renders tbody with 6 rows', () => {
    render(<Appointment customer={customer} />);
    const body = container.querySelector('tbody');
    expect(body).not.toBeNull();
    expect(body.children).toHaveLength(6);
  });

  it('renders 6 expected table headings', () => {
    render(<Appointment customer={customer} stylist={stylist} service={service} notes={notes} />);
    const expectedValues = ['First Name', 'Last Name', 'Phone Number', 'Stylist', 'Service', 'Notes'];
    const appointmentValues = [...container.querySelectorAll('th.heading')].map(node => node.textContent);
    expect(appointmentValues).toEqual(expectedValues);
  });

  it('renders 6 expected table fields with customer info', () => {
    render(<Appointment customer={customer} stylist={stylist} service={service} notes={notes} />);
    const expectedValues = [customer.firstName, customer.lastName, customer.phoneNumber, stylist, service, notes];
    const appointmentValues = [...container.querySelectorAll('td.field')].map(node => node.textContent);
    expect(appointmentValues).toEqual(expectedValues);
  });
});

describe('AppointmentsDayView', () => {
  let container;
  const today = new Date();
  const appointments = [
    { startsAt: today.setHours(12, 0), customer: { firstName: 'Ashley' } },
    { startsAt: today.setHours(13, 0), customer: { firstName: 'Jordan' } },
  ];

  beforeEach(() => {
    container = document.createElement('div');
  });

  const render = component => ReactDOM.render(component, container);

  it('renders a div with the right id', () => {
    render(<AppointmentsDayView appointments={[]} />);
    expect(container.querySelector('div#appointmentsDayView')).not.toBeNull();
  });

  it('renders each appointment in a li', () => {
    render(<AppointmentsDayView appointments={appointments} />);
    expect(container.querySelectorAll('li')).toHaveLength(2);
    expect(container.querySelectorAll('li')[0].textContent).toEqual('12:00');
    expect(container.querySelectorAll('li')[1].textContent).toEqual('13:00');
  });

  it('initially shows a message saying there are no appointments today', () => {
    render(<AppointmentsDayView appointments={[]} />);
    expect(container.textContent).toMatch('There are no appointments scheduled for today.');
  });

  it('selects the first appointment by default', () => {
    render(<AppointmentsDayView appointments={appointments} />);
    expect(container.textContent).toMatch('Ashley');
  });

  it('has a button element in each li', () => {
    render(<AppointmentsDayView appointments={appointments} />);
    expect(container.querySelectorAll('li > button')).toHaveLength(2);
    expect(container.querySelectorAll('li > button')[0].type).toEqual('button');
  });

  it('renders another appointment when selected', () => {
    render(<AppointmentsDayView appointments={appointments} />);
    const button = container.querySelectorAll('button')[1];
    ReactTestUtils.Simulate.click(button);
    expect(container.textContent).toMatch('Jordan');
  });
});
