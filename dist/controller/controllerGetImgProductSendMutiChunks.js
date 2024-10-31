"use strict";
// const { Storage } = require('@google-cloud/storage');
// // const stream = require('stream');
// const storage = new Storage();
// const bucketName = "tour_images"
// const controllerGetImgProductSendMutiChunks = async (req: any, res: any) => {
//     const imageName = req.params.imageName;
//     try {
//         const file = storage.bucket(bucketName).file(imageName);
//         const readStream = file.createReadStream();
//         res.setHeader('Content-Type', 'image/png');
//         readStream.pipe(res);
//     } catch (err) {
//         console.error('Error:', err);
//         res.status(500).send(err);
//     }
// }
// export { controllerGetImgProductSendMutiChunks }
