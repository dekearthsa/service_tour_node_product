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
exports.controllerUpdateProduct = void 0;
const { request: Req } = require('express');
const { response: Res } = require('express');
const { Datastore } = require("@google-cloud/datastore");
const { Storage } = require('@google-cloud/storage');
const typeActivites = require("../interface/activites");
const imageStruct = require("../interface/activites");
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, "../.env") });
const storage = new Storage({
    projectId: "confident-topic-404213",
    keyFilename: path.join(__dirname, "../../key.json"),
});
const KIND = "product";
const datastore = new Datastore();
const BUCKET_NAME = "padtravel"; // Ensure this is your bucket name
const bucket = storage.bucket(BUCKET_NAME);
const controllerUpdateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, region, province, ord, rate, intro, pricePerPerson, activites } = req.body;
    const files = req.files;
    try {
        const jsonActivites = JSON.parse(activites);
        const publicUrls = [];
        const activitesData = [];
        for (const file of files) {
            const blob = bucket.file(file.originalname);
            const blobStream = blob.createWriteStream({
                resumable: false,
                contentType: file.mimetype,
                // Optionally set metadata, e.g., cache control
                metadata: {
                    cacheControl: 'public',
                },
            });
            // Handle errors during upload
            yield new Promise((resolve, reject) => {
                blobStream.on('error', (err) => {
                    console.error('Blob Stream Error:', err);
                    reject(err);
                });
                blobStream.on('finish', () => {
                    // Make the file public
                    blob.makePublic().then(() => {
                        // Construct the public URL
                        const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${encodeURIComponent(blob.name)}`;
                        publicUrls.push({ url: publicUrl, name: file.originalname });
                        resolve();
                    }).catch((err) => {
                        console.error('Make Public Error:', err);
                        reject(err);
                    });
                });
                blobStream.end(file.buffer);
            });
        }
        for (let i = 0; i < jsonActivites.length; i++) {
            let imageUrl = [];
            const arrayName = jsonActivites[i]['imageName'];
            publicUrls.forEach((el) => {
                if (arrayName.includes(el.name)) {
                    imageUrl.push(el.url);
                }
            });
            const payload = {
                day: jsonActivites[i]['day'],
                content: jsonActivites[i]['content'],
                image: imageUrl
            };
            activitesData.push(payload);
        }
        const query = datastore.createQuery(KIND).filter('title', '=', title);
        const [entities] = yield datastore.runQuery(query);
        const keys = entities.map((entity) => entity[datastore.KEY]);
        const taskKey = datastore.key(keys[0]);
        const task = {
            key: taskKey,
            data: {
                title: title ? title : entities[0].title,
                region: region ? region : entities[0].region,
                province: province ? province : entities[0].province,
                ord: ord ? ord : entities[0].ord,
                rate: rate ? rate : entities[0].rate,
                intro: intro ? intro : entities[0].intro,
                pricePerPerson: pricePerPerson ? pricePerPerson : entities[0].pricePerPerson,
                activites: activites ? JSON.stringify(activitesData) : entities[0].pricePerPerson,
            }
        };
        yield datastore.update(task);
    }
    catch (err) {
        console.log(`error in controllerUpdateProduct ${err}`);
        res.status(500).send(err);
    }
});
exports.controllerUpdateProduct = controllerUpdateProduct;
