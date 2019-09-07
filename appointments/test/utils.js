export const singleArgumentSpy = () => {
  let receivedArgument;
  return {
    fn: arg => (receivedArgument = arg),
    receivedArgument: () => receivedArgument
  };
};

export const spy = () => {
  let receivedArguments;
  return {
    fn: (...args) => receivedArguments = args,
    receivedArguments: () => receivedArguments,
    receivedArgument: (n) => receivedArguments[n]
  };
}
