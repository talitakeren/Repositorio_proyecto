import { server } from "./server.js";

class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  getItem(k) {
    return this.store[k] ?? null;
  }
  setItem(k, v) {
    this.store[k] = String(v);
  }
  removeItem(k) {
    delete this.store[k];
  }
  clear() {
    this.store = {};
  }
}

global.localStorage = new LocalStorageMock();

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => {
  server.resetHandlers();
  global.localStorage.clear();
});
afterAll(() => server.close());

process.env.VITE_API_URL = "http://localhost:5001/api";
