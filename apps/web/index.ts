export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return new Response("Hello World from MoralesBuilds app, We are revving up engines!");
  },
};
