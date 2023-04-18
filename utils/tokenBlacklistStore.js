import jwt from 'jsonwebtoken';

export var tokenBlacklistStore;

export const tokenBlacklistStoreFactory = () => {
  const store = new Map();

  tokenBlacklistStore = store;
}
