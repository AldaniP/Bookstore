const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { app } = require('../../index'); 
const Book = require('./book.model');

describe('Book Integration Tests', () => {
    let adminToken;
    const secret = process.env.JWT_SECRET_KEY || 'test-secret-key';

    beforeAll(async () => {
        // Ensure connection is established
        if (mongoose.connection.readyState === 0) {
            const dbUrl = process.env.DB_URL_TEST || process.env.DB_URL;
            if (!dbUrl) throw new Error('DB_URL_TEST is not defined');
            await mongoose.connect(dbUrl);
        }

        // Generate a valid admin token for testing
        adminToken = jwt.sign(
            { id: 'test-admin-id', role: 'admin' },
            secret,
            { expiresIn: '1h' }
        );
    });

    afterAll(async () => {
        // Cleanup test data and close connection
        await Book.deleteMany({ title: 'Integration Test Book' });
        await mongoose.connection.close();
    });

    it('should create a new book in the test database', async () => {
        const bookData = {
            title: 'Integration Test Book',
            description: 'Testing database separation',
            category: 'fiction',
            trending: true,
            coverImage: 'test-image.png',
            oldPrice: 100,
            newPrice: 80
        };

        const response = await request(app)
            .post('/api/books/create-book')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(bookData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Book posted successfully');
        expect(response.body.book.title).toBe('Integration Test Book');

        // Verify it exists in DB
        const bookInDb = await Book.findOne({ title: 'Integration Test Book' });
        expect(bookInDb).not.toBeNull();
        expect(bookInDb.newPrice).toBe(80);
    });

    it('should fetch all books from the test database', async () => {
        const response = await request(app).get('/api/books');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.some(book => book.title === 'Integration Test Book')).toBe(true);
    });
});
