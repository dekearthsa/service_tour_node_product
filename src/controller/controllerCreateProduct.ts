const { request: Req } = require('express')
const { response: Res } = require('express')
const { Datastore } = require("@google-cloud/datastore");
const { Storage } = require('@google-cloud/storage');
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, "../.env") });

const storage = new Storage(
    {
        projectId: "sfsdf",
        keyFilename: path.join(__dirname, "../../key.json"),
    }
)

const KIND = "product"
const datastore = new Datastore();
const BUCKET_NAME = "padtravel"; // Ensure this is your bucket name
const bucket = storage.bucket(BUCKET_NAME);


const controllerCreateProduct = async (req: typeof Req, res: typeof Res) => {
    const {
        title,
        region,
        province,
        ord,
        rate,
        intro,
        pricePerPerson,
        activites
    } = req.body
    const fileName: string[] = [];
    const files = req.files;
    
    try{

        // console.log(files)
        // console.log(activites)
        const jsonActivites = JSON.parse(activites)
        const publicUrls = [];

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
            await new Promise((resolve:any, reject:any) => {
                blobStream.on('error', (err:any) => {
                    console.error('Blob Stream Error:', err);
                    reject(err);
                });

                blobStream.on('finish', () => {
                    // Make the file public
                    blob.makePublic().then(() => {
                        // Construct the public URL
                        const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${encodeURIComponent(blob.name)}`;
                        publicUrls.push(publicUrl);
                        resolve();
                    }).catch((err:any) => {
                        console.error('Make Public Error:', err);
                        reject(err);
                    });
                });

                blobStream.end(file.buffer);
            });
        }

        for(let i = 0; i < jsonActivites.length; i++){
            const arrayName =  jsonActivites[i]['imageName']
            arrayName.forEach((name:string) => {
                
            });
        }
        

        files.forEach((image: any) => {
            fileName.push(image.originalname);
        });

        
        const taskKey = datastore.key([KIND])
        const task = {
            key: taskKey,
            data:{
                title: title,
                region: region,
                province: province,
                ord: ord,
                rate: rate,
                intro: intro,
                pricePerPerson: pricePerPerson,
                activites: activites,
            }
        }
        await datastore.save(task)
        
        res.status(200).send("Create new product success.");
    }catch(err){
        res.status(500).send(err);
    }

}

export {controllerCreateProduct}