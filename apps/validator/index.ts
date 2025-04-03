console.log("Hello via Bun! 🐰 validator ");
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import nacl_util from "tweetnacl-util";
import {
  type SignupOutgoingMessage,
  type OutgoingMessage,
  type ValidateOutgoingMessage,
} from "common/types";
import { randomUUIDv7 } from "bun";
import bs58 from "bs58";

const CALLBACKS: {
  [callbackId: string]: (data: SignupOutgoingMessage) => void;
} = {};

// const validatorId = process.env.VALIDATOR_ID as string;
let validatorId: string | null = null;

async function main() {
  console.log("Starting validator");
  // const keypair = Keypair.fromSecretKey(
  //   Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY!)),
  // );

  const keypair = Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY!));

  console.log(keypair.publicKey.toString());
  const ws = new WebSocket("ws://localhost:8081");

  ws.onmessage = async (event) => {
    const data: OutgoingMessage = JSON.parse(event.data);
    if (data.type === "signup") {
      CALLBACKS[data.data.callbackId]?.(data.data);
      delete CALLBACKS[data.data.callbackId];
    } else if (data.type === "validate") {
      await validateHandler(ws, data.data, keypair);
    }

    ws.onopen = async () => {
      console.log("Connected to server");
      const callbackId = randomUUIDv7();
      CALLBACKS[callbackId] = (data: SignupOutgoingMessage) => {
        validatorId = data.validatorId;
      };
      const signedMessage = await signMessage(
        `Signed message for ${callbackId}, ${keypair.publicKey}`,
        keypair,
      );

      ws.send(
        JSON.stringify({
          type: "signup",
          data: {
            callbackId,
            ip: `127.0.0.1`,
            PublicKey: keypair.publicKey,
            signMessage,
          },
        }),
      );
    };
  };
}

async function validateHandler(
  ws: WebSocket,
  { url, callbackId, websiteId }: ValidateOutgoingMessage,
  keypair: Keypair,
) {
  console.log(`Validating ${url}`);

  const startTime = Date.now();
  const signature = await signMessage(`Replying to ${callbackId}`, keypair);

  try {
    const response = await fetch(url);
    const endtime = Date.now();
    const latency = endtime - startTime;
    const status = response.ok ? "UP" : "DOWN";

    ws.send(
      JSON.stringify({
        type: "validate",
        data: {
          callbackId,
          status,
          latency,
          websiteId,
          validatorId,
          signedMessage: signature,
        },
      }),
    );
  } catch (e) {
    console.error(e);
    ws.send(
      JSON.stringify({
        type: "validate",
        data: {
          callbackId,
          status: "DOWN",
          latenty: 1000,
          websiteId,
          validatorId,
          signedMessage: signature,
        },
      }),
    );
  }
}

async function signMessage(message: string, keypair: Keypair) {
  const messageBytes = nacl_util.decodeUTF8(message);
  const signature = nacl.sign.detached(messageBytes, keypair.secretKey);
  return JSON.stringify(Array.from(signature));
}

main();

setInterval(async () => {}, 10000);
