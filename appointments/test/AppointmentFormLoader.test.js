import React from 'react';
import 'whatwg-fetch';

import { createContainer } from './domManipulators';
import { fetchResponseOk } from './spyHelpers';
import {
  AppointmentFormLoader
} from '../src/AppointmentFormLoader';

import * as AppointmentFormExports from '../src/AppointmentForm';

describe('AppointmentFormLoader', () => {
  let renderAndWait, container;

  const today = new Date();
  const availableTimeSlots = [
    { startsAt: today.setHours(9, 0, 0, 0) }
  ];

  beforeEach(() => {
    ({renderAndWait, container} = createContainer());
    jest.spyOn(window, 'fetch')
      .mockReturnValue(fetchResponseOk(availableTimeSlots));
    jest.spyOn(AppointmentFormExports, 'AppointmentForm')
      .mockReturnValue(null);
  });

  it('fetches data when component is mounted', async () => {
    await renderAndWait(<AppointmentFormLoader />);

    expect(window.fetch).toHaveBeenCalledWith(
      '/availableTimeSlots',
      expect.objectContaining({
        method: 'GET',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });

  it('initially passed no data to the AppointmentForm', async () => {
    await renderAndWait(<AppointmentFormLoader />);

    expect(AppointmentFormExports.AppointmentForm).toHaveBeenCalledWith(
      { availableTimeSlots: [] },
      expect.anything()
    );
  });

  it('displays time slots that are fetched on mount', async () => {
    await renderAndWait(<AppointmentFormLoader />);

    expect(AppointmentFormExports.AppointmentForm)
      .toHaveBeenCalledWith(
        {
          availableTimeSlots
        },
        expect.anything()
      );
  });

  it('passes props through to children', async () => {
    await renderAndWait(<AppointmentFormLoader testProps={123} />);
    expect(AppointmentFormExports.AppointmentForm)
      .toHaveBeenCalledWith(
        expect.objectContaining({ testProps: 123 }),
        expect.anything()
      );
  });

  afterEach(() => {
    window.fetch.mockRestore();
    AppointmentFormExports.AppointmentForm.mockRestore();
  });
});
