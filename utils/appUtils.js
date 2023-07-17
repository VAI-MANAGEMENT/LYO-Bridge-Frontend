const hash256 = async (string) => {

  try {   
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((bytes) => bytes.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  } catch (e) {
    console.log(e);
    return "";
  }
}

const appUtils = {
  hash256: hash256
};

export default appUtils;