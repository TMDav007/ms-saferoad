//This function returns a random digit that is equal to the specified length

export const generateOTP = (OTPlength: number) => {
  return Math.floor(
    Math.pow(10, OTPlength - 1) +
      Math.random() * (Math.pow(10, OTPlength) - Math.pow(10, OTPlength - 1) - 1)
  );
};
