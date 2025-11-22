const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "data", "secretLogs.json");

function loadDB() {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify({ logs: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function saveDB(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
    addLog(log) {
        const db = loadDB();
        db.logs.push(log);
        saveDB(db);
    },

    getLogs() {
        return loadDB().logs;
    }
};
