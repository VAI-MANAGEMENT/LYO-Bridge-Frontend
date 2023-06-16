// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import appLink from "../../utils/urls";

export default async function handler(req, res) {
    try {
        const walletAddress = req.query.fromAddress
        
        var config = {
            method: "GET",
            url: appLink.API_URL + 'bridgeserver-lfi/transactions/download-csv?fromAddress='+ walletAddress,
            headers: {
                'x-api-key': process.env.CUSTOMER_API_KEY
            },
        };
        const result = await axios(config);   
        res.status(200).json(result.data)
    } catch (error) {    
        console.log("🚀 ~ file: exportTransactions.js:19 ~ handler ~ error:", error)
        res.status(200).json({ 'status': 400, mssg: 'An Error Occurred' })
    }
}
