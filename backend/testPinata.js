import dotenv from 'dotenv';
import { uploadJSONToIPFS } from './utils/pinata.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const verifyPinata = async () => {
  console.log("Testing Pinata Upload...");
  try {
    const result = await uploadJSONToIPFS({
      name: "Test JSON",
      description: "Verification of Pinata Keys",
      time: new Date().toISOString()
    });
    console.log("Success! Token URI:", result);
  } catch (error) {
    console.error("Failed:", error.message);
    if (error.response) console.error(error.response.data);
  }
};

verifyPinata();
