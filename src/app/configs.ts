// TODO: I'm simplifying configs.
export const configs = {
  oldestBlock: process.env.OLDEST_BLOCK ?? '47961368',
  blockLimit: process.env.BLOCK_LIMIT ? Number.parseInt(process.env.BLOCK_LIMIT, 10) : 1000,
  mongodbUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/lifi',
};
