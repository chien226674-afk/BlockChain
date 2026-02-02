import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data');

// Ensure file exists
const ensureFile = async (fileName, defaultData = []) => {
  const filePath = path.join(dataPath, fileName);
  try {
    await fs.access(filePath);
  } catch (error) {
    await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2));
  }
};

export const readData = async (fileName) => {
  await ensureFile(fileName);
  const filePath = path.join(dataPath, fileName);
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
};

export const writeData = async (fileName, data) => {
  const filePath = path.join(dataPath, fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};
