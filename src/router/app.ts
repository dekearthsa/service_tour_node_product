const express = require("express");
const cors = require("cors");
const multer = require('multer');

const {controllerDebug} = require("../controller/controllerDebug");
const {controllerCreateProduct} = require("../controller/controllerCreateProduct");
// const {controllerGetImgProductSendMutiImg} = require("../controller/controllerGetImgProductSendMutiImg")
// const {controllerGetImgProductSendMutiChunks} = require("../controller/controllerGetImgProductSendMutiChunks")

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(
    {origin: '*'}
));

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


app.get("/api/debug", controllerDebug)
app.post("/api/create/product", upload.array("images"), controllerCreateProduct)
// app.get("/api/get/img", controllerGetImgProductSendMutiImg)
// app.get("/api/get/img/stream/:imageName", controllerGetImgProductSendMutiChunks)

export {app}