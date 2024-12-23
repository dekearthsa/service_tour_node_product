const { request: Req } = require('express')
const { response: Res } = require('express')
const { Datastore } = require("@google-cloud/datastore");
const { Storage } = require('@google-cloud/storage');
const path = require("path");
const  typeActivites = require("../interface/activites");
const imageStruct = require("../interface/activites");
require('dotenv').config({ path: path.resolve(__dirname, "../../.env") });

const storage = new Storage(
    {
        projectId: "confident-topic-404213",
    }
)

const KIND = "product_page"
const datastore = new Datastore();
const bucket = storage.bucket("padtravel");
const urlCloudStorage = "https://storage.googleapis.com/padtravel"

const controllerCreateProduct = async (req: typeof Req, res: typeof Res) => {
    const {
        isUniID,
        title,
        region,
        province,
        ord,
        rate,
        intro,
        pricePerPerson,
        activites
    } = req.body
    const files = req.files;

    const date = new Date();
    const padZero = (num: number): string => num.toString().padStart(2, '0');

    const day = padZero(date.getDate());
    const month = padZero(date.getMonth() + 1); // Months are zero-based
    const year = padZero(date.getFullYear() % 100); // Get last two digits of the year
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const seconds = padZero(date.getSeconds());

    try{

        const jsonActivites = JSON.parse(activites);
        const publicUrls:typeof imageStruct = [];
        const imagesUrls: string[] = []; 
        const activitesData = [];
        const createTextFileName = `text_${day}_${month}_${year}_${hours}_${minutes}_${seconds}.txt`

        // Iterate over each file and upload to GCS
        let countingFile = 0
        for (const file of files) {
            const createImgName = `${title}_${day}_${month}_${year}_${hours}_${minutes}_${seconds}_${countingFile}.png`
            const instanceFile = bucket.file(createImgName)
            await instanceFile.save(file.buffer, {
                metadata:{
                    contentType: file.mimetype,
                },
                public: true, 
            })
            const payload = {
                url: `${urlCloudStorage}/${createImgName}`,
                name: file.originalname
            }
            publicUrls.push(payload)
            imagesUrls.push(`${urlCloudStorage}/${createImgName}`)
            countingFile += 1
        }

        for(let i = 0; i < jsonActivites.length; i++){
            let imageUrl:string[] = []
            const arrayName =  jsonActivites[i]['imageName']
            publicUrls.forEach((el:typeof imageStruct) => {
                if(arrayName.includes(el.name)){
                    imageUrl.push(el.url)
                }
            })
            const payload: typeof typeActivites = {
                day:jsonActivites[i]['day'],
                content: jsonActivites[i]['content'],
                image: imageUrl

            }
            activitesData.push(payload)
        }

        const textFile = bucket.file(createTextFileName)
        await textFile.save(JSON.stringify(activitesData), {
            metadata: {
                contentType: 'text/plain', 
            },
        })
        
        const taskKey = datastore.key([KIND])
        const task = {
            key: taskKey,
            data:{
                static_id: `${isUniID}${day}${month}${year}${hours}${minutes}${seconds}`,
                images: JSON.stringify(imagesUrls),
                title: title,
                region: region,
                province: province,
                ord: Number(ord),
                rate: Number(rate),
                intro: intro,
                pricePerPerson: pricePerPerson,
                content: createTextFileName,
            }
        }
        // console.log(task)
        await datastore.save(task)
        res.status(200).send("Create new product success.");
    }catch(err){
        console.log(`controllerCreateProduct: ${err}`)
        res.status(500).send(err);
    }

}

export {controllerCreateProduct}