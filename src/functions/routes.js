/*
┌──────────────────────────────────────────┐
│               PasteLitter                │ 
│            All rights Reserved           │ 
└──────────────────────────────────────────┘*/
const path = require("path");
const fs = require("fs");

module.exports = function(app, session) {
    const routes = path.join(__dirname, "..", "backend");

    fs.readdirSync(routes).forEach((file) => {
        if (file.endsWith(".js")) {
            require(`${routes}/${file}`)(app, session);
            console.log(`[+] ${file.replace(".js", "")} has been loaded.`);
        }
    });
}
