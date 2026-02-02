import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../server.js';
import User from '../models/User.js';
import NFT from '../models/NFT.js';
import jsonwebtoken from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mongoServer;
let token;
let user;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.disconnect();
  await mongoose.connect(uri);

  // Create a test user and token
  user = await User.create({
    username: 'nftcreator',
    email: 'creator@example.com',
    password: 'password123',
    walletAddress: '0x1234567890123456789012345678901234567890'
  });

  token = jsonwebtoken.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'your-test-secret',
    { expiresIn: '1h' }
  );
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('NFT API', () => {
  describe('GET /api/nfts', () => {
    it('should fetch all NFTs', async () => {
      await NFT.create({
        name: 'Test NFT 1',
        description: 'Description 1',
        image: 'ipfs://hash1',
        tokenURI: 'ipfs://meta1',
        creator: user._id,
        owner: user._id,
        tokenId: '101'
      });

      const res = await request(app).get('/api/nfts');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.nfts)).toBe(true);
      expect(res.body.nfts.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/nfts/:id', () => {
    it('should fetch a single NFT', async () => {
      const nft = await NFT.create({
        name: 'Single NFT',
        description: 'Unique',
        image: 'ipfs://unique',
        tokenURI: 'ipfs://metasingle',
        creator: user._id,
        owner: user._id,
        tokenId: '999'
      });

      const res = await request(app).get(`/api/nfts/${nft._id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.nft.name).toBe('Single NFT');
    });

    it('should return 404 for non-existent NFT', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/nfts/${fakeId}`);
      expect(res.statusCode).toBe(404);
    });
  });

  // Mocking file upload is complex with supertest and ESM, 
  // but we can test the metadata creation endpoint if it exists separately
});
