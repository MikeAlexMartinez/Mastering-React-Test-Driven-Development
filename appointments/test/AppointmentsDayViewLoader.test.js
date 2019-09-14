import React from 'react';
import 'whatwg-fetch';
import { createContainer } from './domManipulators';
import { fetchResponseOk } from './spyHelpers';
import {
  AppointmentsDayViewLoader
} from '../src/AppointmentsDayViewLoader';

import * as AppointmentsDayViewExports from '../src/AppointmentsDayView';

describe('AppointmentsDayViewLoader', () => {
  let renderAndWait, container;

  const today = new Date();
  const availableTimeSlots = [
    { startsAt: today.setHours(9, 0, 0, 0) },
    { startsAt: today.setHours(10, 0, 0, 0) },
  ];

  beforeEach(() => {
    ({renderAndWait, container} = createContainer());
    jest.spyOn(window, 'fetch')
      .mockReturnValue(fetchResponseOk(availableTimeSlots));
    jest.spyOn(AppointmentsDayViewExports, 'AppointmentsDayView')
      .mockReturnValue(null);
  });

  it('fetches appointments happening today when component is mouted', async () => {
    const from = today.setHours(0, 0, 0, 0);
    const to = today.setHours(23, 59, 59, 999);

    await renderAndWait(
      <AppointmentsDayViewLoader today={today} />
    );
    
    expect(window.fetch).toHaveBeenCalledWith(
      `/appointments/${from}-${to}`,
      expect.objectContaining({
        method: 'GET',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' }
      })
    );
  });

  it('initially passes no data to AppointmentsDayView', async () => {
    await renderAndWait(<AppointmentsDayViewLoader />);

    expect(AppointmentsDayViewExports.AppointmentsDayView)
      .toHaveBeenCalledWith({ appointments: [] }, expect.anything());
  });
  
  // it('fetches data when component is mounted', async () => {
  //   await renderAndWait(<AppointmentsDayViewLoader />);

  //   expect(window.fetch).toHaveBeenCalledWith(
  //     '/availableTimeSlots',
  //     expect.objectContaining({
  //       method: 'GET',
  //       credentials: 'same-origin',
  //       headers: { 'Content-Type': 'application/json' },
  //     })
  //   );
  // });

  // it('initially passed no data to the AppointmentForm', async () => {
  //   await renderAndWait(<AppointmentsDayViewLoader />);

  //   expect(AppointmentFormExports.AppointmentForm).toHaveBeenCalledWith(
  //     { availableTimeSlots: [] },
  //     expect.anything()
  //   );
  // });

  // it('displays time slots that are fetched on mount', async () => {
  //   await renderAndWait(<AppointmentsDayViewLoader />);

  //   expect(AppointmentFormExports.AppointmentForm)
  //     .toHaveBeenCalledWith(
  //       {
  //         availableTimeSlots
  //       },
  //       expect.anything()
  //     );
  // });

  afterEach(() => {
    window.fetch.mockRestore();
    AppointmentsDayViewExports.AppointmentsDayView.mockRestore();
  });
});