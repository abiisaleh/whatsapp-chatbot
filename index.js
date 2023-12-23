require("dotenv").config({ path: "./.env" });
const qrcode = require("qrcode-terminal");

const fs = require('fs'); 
const { Client, LegacySessionAuth } = require('whatsapp-web.js'); 

// Path where the session data will be stored 
const SESSION_FILE_PATH = './session.json'

// Load the session data if it has been previously saved 
let sessionData; 
if(fs.existsSync(SESSION_FILE_PATH)) { sessionData = require(SESSION_FILE_PATH);
}

// Use the saved values 
const client = new Client({ 
  authStrategy: new LegacySessionAuth({ 
    session: sessionData 
  }),
  puppeteer: {
    args: ["--no-sandbox"],
    browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.browserless_api}`,
  },
}); 

// Save session values to the file upon successful auth 
client.on('authenticated', (session) => { 
  sessionData = session; 
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => { 
    if (err) { 
      console.error(err);
    } else {
      console.log("Session saved");
    }
  });
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
