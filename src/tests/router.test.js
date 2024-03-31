const request = require('supertest');
const app = require('../server');

describe('API routes', () => {
  let server;

  // Init app
  beforeAll(() => {
    server = app.listen(4000);
  });

  // Close server
  afterAll((done) => {
    server.close(done);
  });

  // Test GET /api/posts
  test('GET / should return index page', async () => {
    const response = await request(server).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe('text/html');
    expect(response.text).toContain('<title>HOME</title>');
  });

  // Test 404 page
  test('GET /blog/detail should handle missing ID query parameter', async () => {
    const response = await request(server).get('/blog/detail');
    expect(response.statusCode).toBe(404);
  });

});
