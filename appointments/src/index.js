import React from 'react';
import ReactDOM from 'react-dom';
import { AppointmentsDayView } from './AppointmentsDayView';
import { sampleAppointments, buildTimeSlots, services } from './sampleData';
import { CustomerForm } from './CustomerForm';
import { AppointmentForm } from './AppointmentForm';

ReactDOM.render(
  <AppointmentForm
    today={new Date()}
    availableTimeSlots={buildTimeSlots()}
    selectableServices={services}
    onSubmit={(res) => console.log(`submitted: ${JSON.stringify(res)}`)}
  />,
  document.getElementById('root')
);
