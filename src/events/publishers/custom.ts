import { publishEvent } from "./base";

// example with dynamic data
export async function publishExampleEvent(data: { id: string; name: string }) {
  await publishEvent("example.123", JSON.stringify(data));
}

// example with static data
export async function publishExampleOtherEvent() {
  await publishEvent(
    "example.321",
    new Uint8Array([
      123, 34, 105, 100, 34, 58, 49, 50, 51, 44, 34, 110, 97, 109, 101, 34, 58,
      34, 104, 101, 108, 108, 111, 119, 34, 125,
    ]),
  );
}
