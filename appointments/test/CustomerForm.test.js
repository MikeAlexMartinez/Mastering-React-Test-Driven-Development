import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { createContainer } from './domManipulators';
import { CustomerForm } from '../src/CustomerForm';

describe('<CustomerForm />', () => {
  let render, container;

  beforeEach(() => {
    ({ render, container } = createContainer());
  });

  const form = id => container.querySelector(`form[id="${id}"]`);
  const getField = fieldName => form('customer').elements[fieldName];
  const labelFor = formElement => container.querySelector(`label[for="${formElement}"]`);
  const expectToBeInputFieldOfTypeText = formElement => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual('INPUT');
    expect(formElement.type).toEqual('text');
  };
  const itRendersAsATextBox = (fieldName) =>
    it('renders as a text box', () => {
      render(<CustomerForm />);
      expectToBeInputFieldOfTypeText(getField(fieldName));
    });
  const itIncludesTheExistingValue = (fieldName) =>
    it('includes the existing value', () => {
      render(<CustomerForm { ...{ [fieldName]: "A-Value" } } />);
      expect(getField(fieldName).value).toEqual('A-Value');
    });
  const itRendersALabel = (fieldName, labelName) =>
    it('renders a label', () => {
      render(<CustomerForm />);
      expect(labelFor(fieldName)).not.toBeNull();
      expect(labelFor(fieldName).textContent).toEqual(labelName);
    });
  const itAssignsAnIdThatMatchesLabelId = (fieldName) =>
    it('assigns an id that matches the label id', () => {
      render(<CustomerForm />);
      expect(getField(fieldName).id).toEqual(fieldName);
    });
  const itSavesExistingValueWhenSubmitted = (fieldName, existingValue) =>
    it('saves the existing value when submitted', async () => {
      expect.hasAssertions();
      render(
        <CustomerForm
          {...{[fieldName]: existingValue}}
          onSubmit={(submission) => expect(submission[fieldName]).toEqual(existingValue)}
        />
      );

      await ReactTestUtils.Simulate.submit(form('customer'));
    });
  const itSavesNewValueWhenSubmitted = (fieldName, newValue) =>
    it('saves new value when submitted', async () => {
      expect.hasAssertions();
      render(
        <CustomerForm
          {...{ [fieldName]: "A-Value" }}
          onSubmit={(submission) => expect(submission[fieldName]).toEqual(newValue)}
        />
      );

      await ReactTestUtils.Simulate.change(getField(fieldName), { target: { value: newValue }});
      await ReactTestUtils.Simulate.submit(form('customer'));
    });

  it('renders a form', () => {
    render(<CustomerForm />);
    expect(form('customer')).not.toBeNull();
  });

  describe('first name field', () => {
    itRendersAsATextBox('firstName');
    itIncludesTheExistingValue('firstName');
    itRendersALabel('firstName', 'First Name');
    itAssignsAnIdThatMatchesLabelId('firstName');
    itSavesExistingValueWhenSubmitted('firstName', 'Ashley');
    itSavesNewValueWhenSubmitted('firstName', 'Jason');
  });

  describe('last name field', () => {
    itRendersAsATextBox('lastName');
    itIncludesTheExistingValue('lastName');
    itRendersALabel('lastName', 'Last Name');
    itAssignsAnIdThatMatchesLabelId('lastName');
    itSavesExistingValueWhenSubmitted('lastName', 'Smith');
    itSavesNewValueWhenSubmitted('lastName', 'Johnson');
  });

  describe('phone number field', () => {
    itRendersAsATextBox('phoneNumber');
    itIncludesTheExistingValue('phoneNumber');
    itRendersALabel('phoneNumber', 'Phone Number');
    itAssignsAnIdThatMatchesLabelId('phoneNumber');
    itSavesExistingValueWhenSubmitted('phoneNumber', '01234567890');
    itSavesNewValueWhenSubmitted('phoneNumber', '01234890567');
  });

  it('has a submit button', () => {
    render(<CustomerForm />);
    const submitBtn = container.querySelector('input[type="submit"]');
    expect(submitBtn).not.toBeNull();
  });
});