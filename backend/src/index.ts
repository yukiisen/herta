import {getGithubImageUrl} from "./config";
import handleClientMessage from "./server";

Bun.serve({
    port: 8080,
    fetch (req, server) {
        const origin = req.headers.get("origin") || "*";

        if (req.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Origin": origin,
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                    "Access-Control-Allow-Credentials": "true",
                },
            });
        }

        if (req.method === "GET" && URL.parse(req.url)?.pathname == "/username") return new Response(getGithubImageUrl(), { status: 200, headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
        }})

        if (server.upgrade(req)) return new Response("Success", { status: 200 });
        else return new Response("Failed", { status: 400 });
    },
    websocket: {
        open(_ws) {
            console.log("Got a connection!");
        },
        async message(ws, message) {
            await handleClientMessage(ws, message.toString());
        }
    }
})
