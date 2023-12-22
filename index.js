require("dotenv").config({ path: "./.env" });

//express
const express = require("express");
const app = express();
const port = 3000;

//whatsapp api
const { Client } = require("whatsapp-web.js");
const client = new Client({
  puppeteer: {
    headless: false,
    args: ["--no-sandbox"],
    browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.browserless_api}`,
  },
  qrMaxRetries: 10,
  disableMessageHistory: true,
});

// Require the package
const QRCode = require("qrcode");

app.get("/", (req, res) => {
  client.on("ready", () => {
    console.log("Client is ready!");
  });

  client.on("message", (msg) => {
    if (msg.body.includes("/bot")) {
      //chat gpt api
      async function chatBot(question) {
        const response = await fetch(
          process.env.CHATBOT_API_URL + "?question=" + question
        );
        const data = await response.json();
        msg.reply(data);
      }

      chatBot(msg.body);
    }
  });

  client.initialize();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
