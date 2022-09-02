// https://stackoverflow.com//questions/44230998/how-to-get-a-random-enum-in-typescript#answer-55699349

import { randomNumberBetween } from './random-number-between';

export function randomEnum<T>(anEnum: T): T[keyof T] {
  const values: any[] = unpackEnumValues(anEnum);
  const index: number = Math.round(randomNumberBetween(0, values.length - 1));
  const randomValue: T[keyof T] = values[index];
  return randomValue;
}

function unpackEnumValues<T>(anEnum: T): any[] {
  return Object.values(anEnum as { [key: string]: any });
}
