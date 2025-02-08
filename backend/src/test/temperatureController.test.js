const request = require('supertest');
const { app, server } = require('../server'); // Import `server` for testing

describe('Temperature API', () => {
    afterAll((done) => {
        server.close(); // Ensure server is closed after tests
        done();
    });

    it('should return temperature readings', async () => {
        const res = await request(app).get('/api/temperature');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });
});
