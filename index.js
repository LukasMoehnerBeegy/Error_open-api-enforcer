const express = require("express");
const EnforcerMiddleware = require("openapi-enforcer-middleware");
const path = require("path");
const Enforcer = require("openapi-enforcer");

var morgan = require("morgan");
require("dotenv").config();
let sendEmail = require("./utils/appData/sendEmail");
const checkAuthorization = require("./utils/appData/checkAuthorization.js");

async function run() {
  const openapiPath = path.resolve("./OpenApi", "routing.yml");
  const enforcer = EnforcerMiddleware(await Enforcer(openapiPath));

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  await delay(5000);

  debugger;
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

/*
async function run() {
  const openapiPath = path.resolve("./OpenApi", "routing.yml");
  const enforcer = EnforcerMiddleware(await Enforcer(openapiPath));

  const app = express();

  // Add HTTP Logging to express, start the logging here
  app.use(morgan("dev"));

  app.use(express.json());

  //catch useless get requests in Azure Echo, otherwise the log will be full of spam. "echo" is also defined in openApi, but requieres then Authorization
  app.get("/", (req, res) => {
    return res.send("echo");
  });

  // Set the base path "/api" as a prefix for all OpenAPI paths.
  app.use("/api", enforcer.init());

  // Add Auth middleware
  app.use(checkAuthorization); //the 'query' path is actually defined in the OpenApi spec, but Authorization needs to be checked first, regardless of the query path

  const businessunitdatasolar = require("./controllers/businessunitdatasolar");
  // Tell the route builder to handle routing requests.
  debugger;
  app.use(
    enforcer.route({
      // The "users" is mapped to via the "x-controller" value.
      businessunitdatasolar: businessunitdatasolar
    })
  );

  /*
// Create an enforcer middleware instance
enforcer = EnforcerMiddleware(pathToOpenApiDoc);

// Add controller middleware to the enforcer middleware, that will also take care of the routing
enforcer.controllers(controllerDirectory).catch(console.error);
// Add the Open API enforcer middleware runner to the express app.
app.use(enforcer.middleware());
*/
/*
  // Add error handling middleware
  app.use(async (err, req, res, next) => {
    // If the content doesnt fit, it will be an exception and thus we figure this out here
    if (err.exception) {
      console.table(err);

      //
      await sendEmail(
        "ERROR",
        `${" Error in Product Price Interface " + err}`,
        {}, //data
        process.env.ENVIRONMENT, // reason
        globalIdentifier // identifier
      ).catch(err => {
        console.log(
          "Something really went wrong by sending an email! Here is the error",
          err
        );
        // Send response back
        res.set("Content-Type", "text/plain");
        res.status(200); //its wrong, but the Azure Gateway doesnt let anything different out
        res.send(err.message);
      });

      // Send respone back
      res.set("Content-Type", "text/plain");
      res.status(200); //its wrong, but the Azure Gateway doesnt let anything different out
      res.send(err.message);
    } else if (
      err.message == "Error: [object Object]" ||
      err.message == "[object Object]"
    ) {
      console.log(err);

      await sendEmail(
        "ERROR",
        `${" Error: No content from CRM received, most probably because there is a problem with the OAuth Token, check the log " +
          err}`,
        {}, //data
        process.env.ENVIRONMENT, // reason
        globalIdentifier // identifier
      ).catch(err => {
        console.log(
          "Something really went wrong by sending an email! Here is the error",
          err
        );
        res.set("Content-Type", "text/plain");
        res.status(200); //its wrong, but the Azure Gateway doesnt let anything different out
        res.send(
          "Error: No content from CRM received, most probably because there is a problem with the OAuth Token, check the log"
        );
      });
      res.set("Content-Type", "text/plain");
      res.status(200); //its wrong, but the Azure Gateway doesnt let anything different out
      res.send(
        "Error: No content from CRM received, most probably because there is a problem with the OAuth Token, check the log"
      );
    } else if (err) {
      console.log(err);

      await sendEmail(
        "ERROR",
        `${" Error in Product Price Interface " + err}`,
        {}, //data
        process.env.ENVIRONMENT, // reason
        globalIdentifier // identifier,
      ).catch(err => {
        console.log(
          "Something really went wrong by sending an email! Here is the error",
          err
        );
        res.set("Content-Type", "text/plain");
        res.status(200); //its wrong, but the Azure Gateway doesnt let anything different out
        res.send(err.message); // If its a self written error, the message content will be filled in any case
      });
      // Send respone back
      res.set("Content-Type", "text/plain");
      res.status(200); //its wrong, but the Azure Gateway doesnt let anything different out
      res.send(err.message);
    } else {
      console.log(
        "Its unknown whats happened!!! You ended up in index.js in Line 93",
        res
      );
      res.set("Content-Type", "text/plain");
      res.status(200); //its wrong, but the Azure Gateway doesnt let anything different out
      res.send(
        `${" Its unknown whats happened!!! You ended up in index.js in Line 93 " +
          res}`
      ); // If its a self written error, the message content will be filled in any case
    }
  });

  const listener = app.listen(3000, err => {
    if (err) return console.error(err.stack);
    console.log("Server listening on port " + listener.address().port);
  });
}
*/
run().catch(console.error);
