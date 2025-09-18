import { http, HttpResponse } from "msw";
import { errors } from "undici";

export const handlers = [
  http.post("https://api.realworld.io/api/users", async ({ request }) => {
    const { user }: any = await request.json();

    if (user.email === "test@gmail.com") {
      return new HttpResponse(JSON.stringify({ user }), {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }
    return new HttpResponse(
      JSON.stringify({ errors: { email: ["Error Signing Up!"] } }),
      { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }),
];
