export const proto = (
  path: string,
  body?: BodyInit | null,
  method: "POST" | "DELETE" | "GET" = "POST",
  headers: Record<string, string> = {},
) =>
  new Request(`http://localhost/v1${path}`, {
    method,
    headers: {
      "Content-Type": "application/x-protobuf",
      ...headers,
    },
    ...(method === "GET" ? {} : { body }),
  });
