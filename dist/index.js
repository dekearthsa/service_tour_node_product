"use strict";
const { app } = require("./router/app");
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, "../.env") });
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`service haddle backend create product listen to port: ${PORT}, http://localhost:${PORT}/api/debug`);
});
