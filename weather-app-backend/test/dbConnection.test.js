const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('MongoDB Connection', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test('should connect to MongoDB successfully', async () => {
    expect(mongoose.connection.readyState).toBe(1); 
  });

  test('should fail to connect with invalid URI', async () => {
    const invalidUri = 'mongodb://invalid:27017/test';
    await expect(mongoose.connect(invalidUri)).rejects.toThrow();
  });
});
