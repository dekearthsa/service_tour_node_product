"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express = require("express");
const cors = require("cors");
const multer = require('multer');
const { controllerDebug } = require("../controller/controllerDebug");
const { controllerCreateProduct } = require("../controller/controllerCreateProduct");
const { controllerUpdateProduct } = require("../controller/controllerUpdateProduct");
const { controllerRemoveProduct } = require("../controller/controllerRemoveProduct");
// const {controllerGetImgProductSendMutiImg} = require("../controller/controllerGetImgProductSendMutiImg")
// const {controllerGetImgProductSendMutiChunks} = require("../controller/controllerGetImgProductSendMutiChunks")
const app = express();
exports.app = app;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: '*' }));
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.get("/api/debug", controllerDebug);
app.post("/api/create/product", upload.array("images"), controllerCreateProduct);
app.post("/api/remove/product", controllerRemoveProduct);
app.post("/api/update/product", upload.array("images"), controllerUpdateProduct);
