require("dotenv").config({ path: "./.env" });
const qrcode = require("qrcode-terminal");

const fs = require('fs'); 
const { Client, LocalAuth } = require('whatsapp-web.js'); 

// Use the saved values 
const client = new Client({ 
  authStrategy: new LocalAuth({ 
    clientId: "amin" 
  }),
  puppeteer: {
    args: ["--no-sandbox"],
    browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.browserless_api}`,
  },
}); 

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", (msg) => {
  if (msg.body.startsWith("/bot")) {
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
