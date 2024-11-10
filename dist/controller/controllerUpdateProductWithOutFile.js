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
exports.controllerUpdateProductWithOutFile = void 0;
const { request: Req } = require('express');
const { response: Res } = require('express');
const { Datastore } = require("@google-cloud/datastore");
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, "../../.env") });
const KIND = "product_page";
const datastore = new Datastore();
const controllerUpdateProductWithOutFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { 
    // images,
    title, ord, rate, intro, pricePerPerson,
    // activites,
     } = req.body;
    try {
        const query = datastore.createQuery(KIND).filter('title', '=', title);
        const [entities] = yield datastore.runQuery(query);
        const idSet = entities[0][datastore.KEY]['id'];
        const id = parseInt(idSet);
        const taskKey = datastore.key([KIND, id]);
        const task = {
            key: taskKey,
            data: {
                images: entities[0].images,
                title: entities[0].title,
                region: entities[0].region,
                province: entities[0].province,
                ord: ord ? Number(ord) : Number(entities[0].ord),
                rate: rate ? Number(rate) : Number(entities[0].rate),
                intro: intro ? intro : entities[0].intro,
                pricePerPerson: pricePerPerson ? pricePerPerson : entities[0].pricePerPerson,
                content: entities[0].content,
            }
        };
        yield datastore.update(task);
        res.status(200).send("ok");
    }
    catch (err) {
        console.log(`error in controllerUpdateProductWithOutFile ${err}`);
        res.status(500).send(err);
    }
});
exports.controllerUpdateProductWithOutFile = controllerUpdateProductWithOutFile;
