const { request: Req } = require('express')
const { response: Res } = require('express')
const { Datastore } = require("@google-cloud/datastore");

const KIND = "product"
const datastore = new Datastore();


const controllerRemoveProduct = async (req: typeof Req, res: typeof Res) => {
    const {title} = req.body;

    try{
        const query = datastore.createQuery(KIND).filter('title', '=', title);
        const [entities] = await datastore.runQuery(query);
        const keys = entities.map((entity:any) => entity[datastore.KEY]);
        await datastore.delete(keys);
        res.status(200).send(`delete product ${title} success.`)
    }catch(err){
        console.log(`error at controllerRemoveProduct ${err}`)
        res.status(500).send(err)
    }
    
}

export {controllerRemoveProduct}