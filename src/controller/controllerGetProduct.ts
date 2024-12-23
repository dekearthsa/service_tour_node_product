const { request: Req } = require('express')
const { response: Res } = require('express')
const { Datastore } = require("@google-cloud/datastore");
const { Storage } = require('@google-cloud/storage');

const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, "../../.env") });

const storage = new Storage(
    {
        projectId: "confident-topic-404213",
    }
)

const KIND = "product_page"
const datastore = new Datastore();
const bucket = storage.bucket("padtravel");


const controllerGetProduct = async (req: typeof Req, res: typeof Res) => {
    try{
        
        let handlerTask = [];

        const query = datastore.createQuery(KIND)
        const [tasks] = await datastore.runQuery(query);
        
        for(let i = 0; i < tasks.length; i++){
            const fileName = tasks[i].content
            const textFile = bucket.file(fileName);

            try{
                const [contents] = await textFile.download();
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
                }
                handlerTask.push(payload)
            }catch(err){
                console.log("err => ", err , "fileName not found => ", fileName)
            }
            
        }
        res.status(200).send(handlerTask)
    }catch(err){
        res.status(500).send(err)
    }
}

export {controllerGetProduct}