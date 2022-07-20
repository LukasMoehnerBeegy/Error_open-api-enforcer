const express = require("express");
const EnforcerMiddleware = require("openapi-enforcer-middleware");
const path = require("path");
const Enforcer = require("openapi-enforcer");

var morgan = require("morgan");
require("dotenv").config();


async function run() {
  const openapiPath = path.resolve("./OpenApi", "routing.yml");
  const enforcer = EnforcerMiddleware(await Enforcer(openapiPath));

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  await delay(5000);


  // Add this error handler to pick up on route builder errors
  enforcer.on("error", err => {
    console.error(err.stack);
  });

  const app = express();
  app.use(express.json());

  // Set the base path "/api" as a prefix for all OpenAPI paths.
  app.use("/api", enforcer.init());

  // Tell the route builder to handle routing requests.
  app.use(
    enforcer.route({
      // The "users" is mapped to via the "x-controller" value.
      businessunitdatasolar: {
        // The "listUsers" is mapped to via the "x-operation" or "operationId" value.
        async businessunitdatasolar(req, res) {
          debugger;
          res.enforcer.send("users");
        }
      }
    })
  );

  const listener = app.listen(8000, err => {
    if (err) return console.error(err.stack);
    console.log("Listening on port " + listener.address().port);
  });
}

run().catch(console.error);
