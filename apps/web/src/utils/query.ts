export type QueryValue = string | string[] | undefined;

export type SearchParams = Promise<{ [key: string]: QueryValue }>;

export function queryToNumber(value: QueryValue, defaultValue: number = 0): number {
  const valueString = Array.isArray(value) ? value[0] : value;
  const valueNumber = valueString ? Number(valueString) : defaultValue;
  return isNaN(valueNumber) ? defaultValue : valueNumber;
}
