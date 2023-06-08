// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import appLink from "../../utils/urls";

export default async function handler(req, res) {
    try {
        const data = req.body     
      
        var config = {
            method: "POST",
            url: appLink.API_URL + 'bridgeserver-lfi/transactions',
            headers: {
                'x-api-key': process.env.CUSTOMER_API_KEY,
                'Content-Type': 'application/json'
            }, 
            data: data
        };
        const result = await axios(config);          
       
        res.status(200).json(result.data)
    } catch (error) {         
        console.log("🚀 ~ file: saveTransaction.js:23 ~ handler ~ error:", error)
        res.status(200).json({ 'status': 400, mssg: 'An Error Occured' })
    }
}
