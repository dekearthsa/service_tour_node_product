const { request: Req } = require('express')
const { response: Res } = require('express')
const { Datastore } = require("@google-cloud/datastore");
const { Storage } = require('@google-cloud/storage');
const  typeActivites = require("../interface/activites");
const imageStruct = require("../interface/activites");
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, "../../.env") });

const storage = new Storage(
    {
        projectId: "confident-topic-404213",
        // keyFilename: path.join(__dirname, "../../key.json"),
    }
)

const KIND = "product_page"
const datastore = new Datastore();
const BUCKET_NAME = "padtravel"; // Ensure this is your bucket name
const urlCloudStorage = "https://storage.googleapis.com/padtravel"
const bucket = storage.bucket(BUCKET_NAME);

const controllerUpdateProduct = async (req: typeof Req, res: typeof Res) => {
    
    const {
        title,
        ord,
        rate,
        intro,
        pricePerPerson,
        activites
    } = req.body

    // console.log(title)
    // console.log(activites)
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
            if(jsonActivites[i]['imageName']){
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
            
        }

        const query = datastore.createQuery(KIND).filter('title', '=', title);
        const [entities] = await datastore.runQuery(query);
        const idSet = entities[0][datastore.KEY]['id']
        const id = parseInt(idSet)
        const taskKey = datastore.key([KIND,id])
        const task = {
            key: taskKey,
            data:{
                images: JSON.stringify(imagesUrls),
                title: title?title:entities[0].title,
                region: entities[0].region,
                province: entities[0].province,
                ord: ord?new Int16Array(ord):new Int16Array(entities[0].ord),
                rate: rate?new Int16Array(rate):new Int16Array(entities[0].rate),
                intro: intro?intro:entities[0].intro,
                pricePerPerson: pricePerPerson?pricePerPerson:entities[0].pricePerPerson,
                content: activites?JSON.stringify(activitesData):entities[0].activites,
            }
        }

        // const task = {
        //     // key: taskKey,
        //     data:{
        //         images: JSON.stringify(imagesUrls),
        //         title: title,
        //         // region: region,
        //         // province: province,
        //         ord: ord,
        //         rate: rate,
        //         intro: intro,
        //         pricePerPerson: pricePerPerson,
        //         content: JSON.stringify(activitesData),
        //     }
        // }
        // console.log(task)
        await datastore.update(task);
        res.status(200).send("ok")
    }catch(err){
        console.log(`error in controllerUpdateProduct ${err}`)
        res.status(500).send(err)
    }
}

export {controllerUpdateProduct}