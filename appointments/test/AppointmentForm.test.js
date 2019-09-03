import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { createContainer } from './domManipulators';
import { AppointmentForm, TimeSlotTable } from '../src/AppointmentForm';

describe('AppointmentForm', () => {
  let render, container;

  beforeEach(() => {
    ({ render, container } = createContainer());
  });

  const services = ['Cut', 'Blow-dry'];

  const form = id => container.querySelector(`form[id="${id}"]`);
  const getField = fieldName => form('appointment').elements[fieldName];
  const labelFor = formElement => container.querySelector(`label[for="${formElement}"]`);

  it('renders a form', () => {
    render(<AppointmentForm />);
    expect(form('appointment')).not.toBeNull();
  });


  describe('service field', () => {
    const findOption = (dropdownNode, textContent) => {
      const options = [...dropdownNode.childNodes];
      return options.find(option => option.textContent === textContent);
    }

    it('renders as a select box', () => {
      render(<AppointmentForm />);
      expect(getField('service')).not.toBeNull();
      expect(getField('service').tagName).toEqual('SELECT');
    });

    it('initially has a blank value', () => {
      render(<AppointmentForm />);
      const firstNode = getField('service').childNodes[0];
      expect(firstNode.value).toEqual('');
      expect(firstNode.selected).toBeTruthy();
    });

    it('lists all salon services', () => {
      render(<AppointmentForm selectableServices={services} />);
      const optionNodes = [...getField('service').childNodes];
      const renderedServices = optionNodes.map(node => node.textContent);
      expect(renderedServices).toEqual(['', ...services]);
    })

    it('pre-selects the existing value', () => {
      render(
        <AppointmentForm
          selectableServices={services}
          service={services[1]}
        />
      );
      const option = findOption(getField('service'), services[1]);
      expect(option.selected).toBeTruthy();
    });

    it('renders a label', () => {
      render(<AppointmentForm />);
      expect(labelFor('service')).not.toBeNull();
      expect(labelFor('service').textContent).toEqual('Select A Service');
    });

    it('assigns an id that matches the label id', () => {
      render(<AppointmentForm />);
      expect(getField('service').id).toEqual('service');
    });

    it('saves the existing value when submitted', async () => {
      expect.hasAssertions();
      render(
        <AppointmentForm
          selectableServices={services}
          service={services[1]}
          onSubmit={({ service }) => expect(service).toEqual(services[1])}
        />
      );
      
      await ReactTestUtils.Simulate.submit(form('appointment'));
    });

    it('saves the newly selected value when submitted', async () => {
      expect.hasAssertions();
      render(
        <AppointmentForm
          selectableServices={services}
          service={services[1]}
          onSubmit={({ service }) => expect(service).toEqual(services[0])}
        />
      );

      await ReactTestUtils.Simulate.change(getField('service'), { target: { value: services[0] }});
      await ReactTestUtils.Simulate.submit(form('appointment'))
    });
  });

  describe('time slot table', () => {
    const timeSlotTable = () => container.querySelector('table#time-slots');

    it('renders a table for time slots', () => {
      render(<AppointmentForm />);
      expect(timeSlotTable()).not.toBeNull();
    });

    it('renders a time slot for every half an hour between open and close times', () => {
      render(<AppointmentForm salonOpensAt={9} salonClosesAt={11}/>);
      const timesOfDay = timeSlotTable().querySelectorAll('tbody >* th');
      expect(timesOfDay).toHaveLength(4);
      expect(timesOfDay[0].textContent).toEqual('09:00');
      expect(timesOfDay[1].textContent).toEqual('09:30');
      expect(timesOfDay[3].textContent).toEqual('10:30');
    });

    it('renders an empty cell at the start of the header cell', () => {
      render(<AppointmentForm />);
      const headerRow = timeSlotTable().querySelector('thead > tr');
      expect(headerRow.firstChild.textContent).toEqual('');
    });

    it('renders a week of available dates', () => {
      const today = new Date(2018, 11, 1);
      render(<AppointmentForm today={today} />);
      const dates = timeSlotTable().querySelectorAll('thead >* th:not(:first-child)');
      expect(dates).toHaveLength(7);
      expect(dates[0].textContent).toEqual('Sat 01');
      expect(dates[1].textContent).toEqual('Sun 02');
      expect(dates[6].textContent).toEqual('Fri 07');
    });
  });
});