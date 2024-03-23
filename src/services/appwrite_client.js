require('dotenv').config();
const { Client, Account, Databases } =  require("appwrite");

const client = new Client();

const account = new Account(client);
client
.setEndpoint(process.env.APPWRITE_URL)
    .setProject(process.env.APPWRITE_PROJECT);
const databases = new Databases(client);


module.exports = {
    client,
    account,
    databases
};
