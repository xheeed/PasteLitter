const path = require("path");
const fs = require("fs");

module.exports = function(app, session) {
    const routes = path.join(__dirname, "..", "backend");

    fs.readdirSync(routes).forEach((file) => {
        if (file.endsWith(".js")) {
            const route = require(`${routes}/${file}`)(app, session);
            console.log(`${route} has been initiated`);
        }
    });
}

module.exports = routes;