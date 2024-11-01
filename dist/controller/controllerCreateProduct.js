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
exports.controllerCreateProduct = void 0;
const { request: Req } = require('express');
const { response: Res } = require('express');
const { Datastore } = require("@google-cloud/datastore");
const { Storage } = require('@google-cloud/storage');
const path = require("path");
const typeActivites = require("../interface/activites");
const imageStruct = require("../interface/activites");
require('dotenv').config({ path: path.resolve(__dirname, "../.env") });
const storage = new Storage({
    projectId: "confident-topic-404213",
    keyFilename: path.join(__dirname, "../../key.json"),
});
const KIND = "product";
const datastore = new Datastore();
const BUCKET_NAME = "padtravel"; // Ensure this is your bucket name
const bucket = storage.bucket(BUCKET_NAME);
const controllerCreateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, region, province, ord, rate, intro, pricePerPerson, activites } = req.body;
    const files = req.files;
    try {
        const jsonActivites = JSON.parse(activites);
        const publicUrls = [];
        const activitesData = [];
        // Iterate over each file and upload to GCS
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
        const taskKey = datastore.key([KIND]);
        const task = {
            key: taskKey,
            data: {
                title: title,
                region: region,
                province: province,
                ord: ord,
                rate: rate,
                intro: intro,
                pricePerPerson: pricePerPerson,
                activites: JSON.stringify(activites),
            }
        };
        yield datastore.save(task);
        res.status(200).send("Create new product success.");
    }
    catch (err) {
        console.log(`controllerCreateProduct: ${err}`);
        res.status(500).send(err);
    }
});
exports.controllerCreateProduct = controllerCreateProduct;
