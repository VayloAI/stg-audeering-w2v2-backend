import path from "node:path";

import { describe, expect, test } from "bun:test";
import {
  AudioGenderDetectRequest,
  AudioGenderDetectResult,
  AudioGenderSelectRequest,
  DetectProcessStatus,
} from "@vaylo/proto/stg";
import { sign } from "elysia-protobuf";

import { app } from "@/index";
import { proto } from "./utils";
import config from "@/config";

const { secret, secretHeader } = config.server;

describe("audio-gender", () => {
  let file_id = "";
  test("detect", async () => {
    const file = await Bun.file(
      path.join(__dirname, "2086-149220-0033.wav"),
    ).bytes();
    const data = AudioGenderDetectRequest.encode({
      file,
    }).finish();

    const signature = await sign(data, secret);
    const response = await app.handle(
      proto("/audio-gender/detect", new Blob([data as BlobPart]), "POST", {
        [secretHeader]: signature,
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/x-protobuf");

    const body = await response.arrayBuffer();
    const result = AudioGenderDetectResult.decode(new Uint8Array(body));
    file_id = result.file_id;

    if (result.status === DetectProcessStatus.WAITING) {
      expect(result.female_prob === result.male_prob).toBe(true);
      expect(result.female_prob).toBeNull();
      return;
    }

    expect(result.status).toBe(DetectProcessStatus.SUCCESS);
    expect(result.male_prob! > result.female_prob!).toBe(true);
  });

  const getSelectProto = () =>
    AudioGenderSelectRequest.encode({
      file_id,
    }).finish();

  test("select", async () => {
    const data = getSelectProto();
    const signature = await sign(data, secret);
    const response = await app.handle(
      proto("/audio-gender/cache", new Blob([data as BlobPart]), "POST", {
        [secretHeader]: signature,
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/x-protobuf");

    const body = await response.arrayBuffer();
    const result = AudioGenderDetectResult.decode(new Uint8Array(body));

    expect(result.file_id).toBe(file_id);
    expect(result.status).toBeOneOf([
      DetectProcessStatus.SUCCESS,
      DetectProcessStatus.WAITING,
    ]);
    if (result.status === DetectProcessStatus.SUCCESS) {
      expect(result.male_prob! > result.female_prob!).toBe(true);
    }
  });

  test("delete", async () => {
    const data = getSelectProto();
    const signature = await sign(data, secret);
    const response = await app.handle(
      proto("/audio-gender/cache", new Blob([data as BlobPart]), "DELETE", {
        [secretHeader]: signature,
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/x-protobuf");

    const body = await response.arrayBuffer();
    const result = AudioGenderDetectResult.decode(new Uint8Array(body));

    expect(result.file_id).toBe(file_id);
    expect(result.status).toBeOneOf([
      DetectProcessStatus.SUCCESS,
      DetectProcessStatus.WAITING,
    ]);
  });

  test("get after delete", async () => {
    // check correct deletion
    const data = getSelectProto();
    const signature = await sign(data, secret);
    const response = await app.handle(
      proto("/audio-gender/cache", new Blob([data as BlobPart]), "POST", {
        [secretHeader]: signature,
      }),
    );

    expect(response.status).toBe(404);
  });
});
