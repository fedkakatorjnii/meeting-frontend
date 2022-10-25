type Hem = 'N' | 'S' | 'E' | 'W';
type CoordType = 'lon' | 'lat';

interface OptionsTypes {
  type: CoordType;
  value: number;
}

const regexp = /[SWNE_'\s]/g;

const completeNumberToDigit = (value: number, digit_: number): string => {
  let zeros = '';
  let digit = digit_;

  while (value < digit && digit > 1) {
    zeros += '0';
    digit /= 10;
  }

  return `${zeros}${value}`;
};

const getHem = ({ type, value }: OptionsTypes): Hem => {
  if (type === 'lat') return value > 0 ? 'N' : 'S';

  return value > 0 ? 'E' : 'W';
};

export const getClampedValue = (props: OptionsTypes): number => {
  const limitsMap: Record<CoordType, { min: number; max: number }> = {
    lat: {
      min: -90,
      max: 90,
    },
    lon: {
      min: -180,
      max: 180,
    },
  };

  return Math.min(
    Math.max(props.value, limitsMap[props.type].min),
    limitsMap[props.type].max,
  );
};

export const coordinatesFormatToString = (props: OptionsTypes): string => {
  const coord: number = props.value > 0 ? props.value : -props.value;
  const deg: number = Math.trunc(coord);
  const minute: number = (coord - deg) * 60;

  const hem = getHem(props);
  const degrees =
    props.type === 'lon'
      ? completeNumberToDigit(deg, 100)
      : completeNumberToDigit(deg, 10);

  return `${degrees}°${
    minute < 10 ? '0' + minute.toFixed(3) : minute.toFixed(3)
  }' ${hem}`;
};

export const coordinatesFormatToDec = (value: string): number => {
  const str = value.trim();
  const hem = str[str.length - 1];
  const coord = str.replace(regexp, '');
  const arr = coord.split('°');
  const resCoord = Number(arr[0]) + Number(arr[1]) / 60;

  if (hem === 'S' || hem === 'W') return -resCoord;

  return resCoord;
};
