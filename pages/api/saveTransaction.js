// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import appLink from "../../utils/urls";
import appUtils from "../../utils/appUtils";

const qs = require("qs");


export default async function handler(req, res) {
    try {
        const data = req.body
        const headerKey = req.headers['x-api-key']     
        const hashKey = await appUtils.hash256(qs.stringify(data))    
        console.log("🚀 ~ file: saveTransaction.js:14 ~ handler ~ hashKey:", headerKey,hashKey)
       
        const config = {
            method: "POST",
            url: appLink.API_URL + 'bridgeserver-lfi/transactions',
            headers: {
                'x-api-key': process.env.CUSTOMER_API_KEY,
                'Content-Type': 'application/json'
            }, 
            data: data
        };

        if(headerKey === hashKey){
            const result = await axios(config);        
            res.status(200).json(result.data)
        }

        else{
            res.status(400).json({ 'status': 400, msg: 'An Error Occurred' })
        }
     
    } catch (error) {       
        res.status(200).json({ 'status': 400, msg: 'An Error Occurred' })
    }
}
