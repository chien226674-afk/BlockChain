import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

// const PINATA_API_KEY = process.env.PINATA_API_KEY; // Read inside function
// const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

export const uploadFileToIPFS = async (file) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  let data = new FormData();
  
  // File is expected to be a multer file object with .path
  data.append('file', fs.createReadStream(file.path));

  const metadata = JSON.stringify({
    name: file.originalname,
  });
  data.append('pinataMetadata', metadata);

  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  });
  data.append('pinataOptions', pinataOptions);

  try {
    const res = await axios.post(url, data, {
      maxBodyLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_KEY,
      },
    });
    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  } catch (error) {
    console.error("Pinata File Upload Error:", error);
    throw error;
  }
};

export const uploadJSONToIPFS = async (body) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  
  try {
    const res = await axios.post(url, body, {
      headers: {
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_KEY,
      },
    });
    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  } catch (error) {
    console.error("Pinata JSON Upload Error:", error);
    throw error;
  }
};
