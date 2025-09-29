import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index';

let token = '';
let vehicleId = '';
let deliveryId = '';

beforeAll(async () => {
  // Register and login to get JWT
  await request(app)
    .post('/api/auth/register')
    .send({ name: 'Test', email: 'test@example.com', password: 'password123', role: 'admin' });
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'test@example.com', password: 'password123' });
  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Vehicle API', () => {
  it('should create a vehicle', async () => {
    const res = await request(app)
      .post('/api/v1/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'Truck', make: 'Volvo', model: 'VNL', year: 2022, fuelType: 'Diesel', capacity: 10000, range: 800, emissionsFactor: 2.5 });
    expect(res.statusCode).toBe(201);
    vehicleId = res.body._id;
  });
  it('should get all vehicles', async () => {
    const res = await request(app)
      .get('/api/v1/vehicles')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});

describe('Delivery API', () => {
  it('should create a delivery', async () => {
    const res = await request(app)
      .post('/api/v1/deliveries')
      .set('Authorization', `Bearer ${token}`)
      .send({ source: 'Warehouse A', destinations: ['Address 1', 'Address 2'], vehicle: vehicleId, status: 'scheduled', scheduledAt: new Date().toISOString() });
    expect(res.statusCode).toBe(201);
    deliveryId = res.body._id;
  });
  it('should get all deliveries', async () => {
    const res = await request(app)
      .get('/api/v1/deliveries')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});

describe('Route Optimization API', () => {
  it('should optimize a route', async () => {
    const res = await request(app)
      .post('/api/v1/optimize-route/optimize')
      .set('Authorization', `Bearer ${token}`)
      .send({ source: 'Warehouse A', destinations: ['Address 1', 'Address 2'], vehicleType: 'Truck' });
    expect(res.statusCode).toBe(200);
  });
});

describe('Clustering API', () => {
  it('should cluster deliveries', async () => {
    const res = await request(app)
      .post('/api/v1/cluster-deliveries/cluster')
      .set('Authorization', `Bearer ${token}`)
      .send({ deliveryPoints: [{ lat: 12.9, lng: 77.6 }, { lat: 12.8, lng: 77.7 }] });
    expect(res.statusCode).toBe(200);
  });
});

describe('Emissions API', () => {
  it('should get emissions metrics', async () => {
    const res = await request(app)
      .get('/api/v1/emissions/metrics')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});

describe('Analytics API', () => {
  it('should get dashboard KPIs', async () => {
    const res = await request(app)
      .get('/api/v1/analytics/dashboard')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});

describe('Simulation API', () => {
  it('should simulate routing', async () => {
    const res = await request(app)
      .post('/api/v1/admin/simulate')
      .set('Authorization', `Bearer ${token}`)
      .send({ weights: { emissions: 0.5, time: 0.3, cost: 0.2 }, scenario: { test: true } });
    expect(res.statusCode).toBe(200);
  });
});

describe('Bulk API', () => {
  it('should bulk upload', async () => {
    const res = await request(app)
      .post('/api/v1/bulk/upload')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.statusCode).toBe(200);
  });
  it('should export plan', async () => {
    const res = await request(app)
      .get('/api/v1/bulk/export')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
}); 