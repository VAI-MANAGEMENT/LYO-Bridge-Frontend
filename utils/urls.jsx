import constants from "./constants";

const api_Link = () => {
    if (constants.API_MODE == "prod") {
        return process.env.X_API_PROD
    }
    if (constants.API_MODE == "staging") {
        return process.env.X_API_STAGING
    }
    else if (constants.API_MODE == "local") {
        return process.env.X_API_LOCAL_SERVER
    } 
     else {
        return process.env.X_API_STAGING
    }
}

const appLink = {    
    "API_URL": api_Link(),    
}

export default appLink;