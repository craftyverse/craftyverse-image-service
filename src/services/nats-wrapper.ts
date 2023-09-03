import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error("Cannot access the NATS client before connecting");
    }

    return this._client;
  }

  // This creates a instance of the NATS event bus
  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this.client!.on("connect", () => {
        console.log("NATS event bus successfully connected!");
        resolve();
      });

      this.client!.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
