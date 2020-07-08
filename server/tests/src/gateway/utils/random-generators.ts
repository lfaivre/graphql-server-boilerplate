import randomize from 'randomatic';

export const randomAlphaNumeric = (length: number): string => {
  return randomize('Aa0', length);
};

export const randomAny = (length: number): string => {
  return randomize('*', length);
};
