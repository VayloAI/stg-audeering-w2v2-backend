import path from "node:path";
import * as ort from "onnxruntime-node";
import decodeAudio from "audio-decode";
import { create, ConverterType } from "@alexanderolsen/libsamplerate-js";

import { log } from "@/logging";
import { softmax } from "@/utils/tasks";

const MODEL_PATH = path.join(__dirname, "model", "model.onnx");
const REQUIRED_SAMPLE_RATE = 16000;
const AUDIO_CHANNELS = 1;

async function initSession() {
  try {
    return await ort.InferenceSession.create(MODEL_PATH);
  } catch (err) {
    log.error(`Failed to load ONNX model: ${(err as Error).message}.`);
    return false;
  }
}

const session = await initSession();

export async function recognize(input: ArrayBuffer | Uint8Array) {
  try {
    if (!session) {
      throw new Error("Session not initialized");
    }

    const audioBuffer = await decodeAudio(input);
    let channelData = audioBuffer.getChannelData(0);
    if (audioBuffer.sampleRate !== REQUIRED_SAMPLE_RATE) {
      const sampler = await create(
        AUDIO_CHANNELS,
        audioBuffer.sampleRate,
        REQUIRED_SAMPLE_RATE,
        {
          converterType: ConverterType.SRC_SINC_FASTEST,
        },
      );
      channelData = sampler.simple(channelData);
    }

    const signal = new ort.Tensor("float32", channelData, [
      1,
      channelData.length,
    ]);

    const {
      logits_age: {
        data: [age],
      },
      logits_gender: { data: genderData },
    } = await session.run({ signal }, [
      "hidden_states",
      // [0...1] (== 100 years)
      "logits_age",
      // [female, male, children]
      "logits_gender",
    ]);

    const [female, male, children] = softmax(genderData as Float32Array);

    return {
      age,
      female,
      male,
      children,
    };
  } catch (err) {
    log.error(`Failed to recognize: ${(err as Error).message}`);
    return false;
  }
}
