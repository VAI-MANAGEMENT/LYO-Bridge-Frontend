// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import appLink from "../../utils/urls";

export default async function handler(req, res) {
    try {
        var config = {
            method: "GET",
            url: appLink.API_URL + 'bridgeserver-lfi/chains'
        };
        const result = await axios(config);
       
        res.status(200).json(result.data)
    } catch (error) {       
        console.log("🚀 ~ file: networks.js:15 ~ handler ~ error:", error)
        res.status(200).json({ 'status': 400, mssg: 'An Error Occured' })
    }
}
