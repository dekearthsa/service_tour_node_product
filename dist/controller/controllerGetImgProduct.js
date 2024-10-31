"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.controllerGetImgProduct = void 0;
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
const BUCKET = "demostoragebucketearth";
const controllerGetImgProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const DEMO_IMG = ["Earth_1_E_2022-10-28T14:45:42.954263+07:00.png", "Earth_Screenshot 2566-10-02 at 20.19.13.png"];
        const IMAGE_BUFF = [];
        for (const imageName of DEMO_IMG) {
            const file = storage.bucket(BUCKET).file(imageName);
            const [fileBuffer] = yield file.download();
            IMAGE_BUFF.push(fileBuffer);
        }
        res.setHeader('Content-Type', 'application/json');
        res.json(IMAGE_BUFF);
        // const file = await storage.bucket(BUCKET).file(DEMO_IMG)
        // const fileBuffer = await file.download();
        // res.setHeader('Content-Type', 'image/png');
        // res.setHeader('Content-Disposition', `inline; filename="${DEMO_IMG_2}"`);
        // res.send(fileBuffer[0]);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});
exports.controllerGetImgProduct = controllerGetImgProduct;
