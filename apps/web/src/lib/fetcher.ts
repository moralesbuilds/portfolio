export class HTTPError extends Error {
  status: number;
  info?: any;

  constructor(message: string, status: number, info?: any) {
    super(message);
    this.name = 'HTTPError';
    this.status = status;
    this.info = info;
  }
}

export async function fetchWithStatusHandling<T>(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    let info;
    try {
      info = await res.json();
    } catch {
      info = { message: "Failed to parse error response" };
    }
    throw new HTTPError("An error ocurred while fetching the data.", res.status, info);
  }
  return res.json<T>();
}
