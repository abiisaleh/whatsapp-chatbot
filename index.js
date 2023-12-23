require("dotenv").config({ path: "./.env" });
const qrcode = require("qrcode-terminal");

const { Client, LocalAuth } = require('whatsapp-web.js'); 

const client = new Client({ 
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: false,
    args: ["--no-sandbox"],
    browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.browserless_api}`,
  },
}); 

client.initialize();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => { 
  console.log('session saved');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
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
