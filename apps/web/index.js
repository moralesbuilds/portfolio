export default {
  async fetch(request, env, ctx) {
    return new Response("Hello World from my existing app!");
  },
};
