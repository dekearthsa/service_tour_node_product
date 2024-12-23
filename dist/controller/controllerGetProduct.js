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
exports.controllerGetProduct = void 0;
const { request: Req } = require('express');
const { response: Res } = require('express');
const { Datastore } = require("@google-cloud/datastore");
const { Storage } = require('@google-cloud/storage');
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, "../../.env") });
const storage = new Storage({
    projectId: "confident-topic-404213",
});
const KIND = "product_page";
const datastore = new Datastore();
const bucket = storage.bucket("padtravel");
const controllerGetProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let handlerTask = [];
        const query = datastore.createQuery(KIND);
        const [tasks] = yield datastore.runQuery(query);
        for (let i = 0; i < tasks.length; i++) {
            const fileName = tasks[i].content;
            const textFile = bucket.file(fileName);
            try {
                const [contents] = yield textFile.download();
                const payload = {
                    static_id: tasks[i].static_id,
                    images: tasks[i].images,
                    title: tasks[i].title,
                    region: tasks[i].region,
                    province: tasks[i].province,
                    ord: tasks[i].ord,
                    rate: tasks[i].rate,
                    intro: tasks[i].intro,
                    pricePerPerson: tasks[i].pricePerPerson,
                    content: contents.toString()
                };
                handlerTask.push(payload);
            }
            catch (err) {
                console.log("err => ", err, "fileName not found => ", fileName);
            }
        }
        res.status(200).send(handlerTask);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.controllerGetProduct = controllerGetProduct;
