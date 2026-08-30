import { WorkerEntrypoint } from "cloudflare:workers";

export default class extends WorkerEntrypoint<Env> {
  async fetch(request: Request) {
    let message = "Hello World from MoralesBuilds app, We are revving up engines!";
    const wordsObject = await this.env.EXAMPLES_BUCKET.get('random-words.txt');
    if (!wordsObject) {
      message += "\nWe don't have word of the day";
    } else {
      const words = await wordsObject.text();
      const wordList = words.split('\n');
      const idx = Math.floor(Math.random() * wordList.length);
      message += "\nWord of the day: " + wordList[idx];
    }
    return new Response(message);
  }
};