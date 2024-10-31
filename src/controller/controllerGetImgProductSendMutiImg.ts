const { Storage } = require('@google-cloud/storage')

const storage = new Storage()
const BUCKET = "tour_images"

const controllerGetImgProductSendMutiImg = async (req:any, res:any) => {
    try{
        
        const DEMO_IMG = ["Earth_1_E_2022-10-28T14:45:42.954263+07:00.png", "Earth_Screenshot 2566-10-05 at 23.25.41.png"]
        const IMAGE_BUFF = []

        for (const imageName of DEMO_IMG){
            const file = storage.bucket(BUCKET).file(imageName)
            const [fileBuffer] = await file.download()
            IMAGE_BUFF.push(fileBuffer)
        }

        res.setHeader('Content-Type', 'application/json');
        res.json(IMAGE_BUFF);
        // const file = await storage.bucket(BUCKET).file(DEMO_IMG)
        // const fileBuffer = await file.download();

        // res.setHeader('Content-Type', 'image/png');
        // res.setHeader('Content-Disposition', `inline; filename="${DEMO_IMG_2}"`);
        // res.send(fileBuffer[0]);

    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }

}

export {controllerGetImgProductSendMutiImg}