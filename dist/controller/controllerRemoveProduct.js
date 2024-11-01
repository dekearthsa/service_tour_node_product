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
exports.controllerRemoveProduct = void 0;
const { request: Req } = require('express');
const { response: Res } = require('express');
const { Datastore } = require("@google-cloud/datastore");
const KIND = "product";
const datastore = new Datastore();
const controllerRemoveProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = req.body;
    try {
        const query = datastore.createQuery(KIND).filter('title', '=', title);
        const [entities] = yield datastore.runQuery(query);
        const keys = entities.map((entity) => entity[datastore.KEY]);
        yield datastore.delete(keys);
        res.status(200).send(`delete product ${title} success.`);
    }
    catch (err) {
        console.log(`error at controllerRemoveProduct ${err}`);
        res.status(500).send(err);
    }
});
exports.controllerRemoveProduct = controllerRemoveProduct;
