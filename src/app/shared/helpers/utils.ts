export const isEmptyObject = (obj: Object): boolean => {
  if (Object.keys(obj).length === 0 && obj.constructor === Object) { return false; } else { return true; }
};

export const encodeBase64 = (val: string): string => {
  return btoa(val);
};

export const decodeBase64 = (val: string): string => {
  return atob(val);
};

export const getValuesID = (val: string): Array<string> => {
  return val.split(':');
};

export const getPathUrl = (url: string): string => {
  return url.substr(1).trim();
};

export const generateRandomKey = (): string => {
  const crypto = window.crypto;

  return Array
    .from(crypto.getRandomValues(new Uint8Array(16)))
    .map(c => (c < 16 ? '0' : '') + c.toString(16)).join('');
};

export const thousandNumberFormat = (value, fractionSize: number = 2): string => {
  const DECIMAL_SEPARATOR = '.';
  const THOUSANDS_SEPARATOR = ',';
  const padding = '00';
  const numberOrDecimal = /^-?\d*\.?\d*$/;
  value = value.replace(/,/g, '');

  if (value === '' || value === '.') {
    return '';
  }
  if (!numberOrDecimal.test(value)) {
    value = value.replace(/.$/, '');
  }

  let integer = value.toString().split(DECIMAL_SEPARATOR)[0];
  let fraction = value.toString().split(DECIMAL_SEPARATOR)[1];

  integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, THOUSANDS_SEPARATOR);

  if (value % 1 === 0) {
    if (value.substr(-1) === '.') {
      return integer + '.';
    }
    return integer;
  } else {
    fraction = DECIMAL_SEPARATOR + (fraction + padding).substring(0, fractionSize);
    return integer + fraction;
  }
};
