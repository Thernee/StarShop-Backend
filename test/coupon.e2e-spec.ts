import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('CouponController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /coupons', () => {
    it('should create a new coupon', () => {
      const createCouponDto = {
        code: 'E2ETEST10',
        type: 'percentage',
        value: 10,
        minPurchaseAmount: 50,
        maxDiscountAmount: 100,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
        usageLimit: 100,
        created_by: 'admin1',
      };

      return request(app.getHttpServer())
        .post('/coupons')
        .send(createCouponDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.code).toBe(createCouponDto.code);
          expect(res.body.type).toBe(createCouponDto.type);
          expect(res.body.value).toBe(createCouponDto.value);
        });
    });

    it('should return 400 if coupon code already exists', async () => {
      const createCouponDto = {
        code: 'E2ETEST10',
        type: 'percentage',
        value: 10,
        minPurchaseAmount: 50,
        maxDiscountAmount: 100,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
        usageLimit: 100,
        created_by: 'admin1',
      };

      // First create a coupon
      await request(app.getHttpServer()).post('/coupons').send(createCouponDto).expect(201);

      // Try to create another coupon with the same code
      return request(app.getHttpServer())
        .post('/coupons')
        .send(createCouponDto)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('Coupon code already exists');
        });
    });
  });

  describe('GET /coupons/:code', () => {
    it('should return a coupon by code', async () => {
      const code = 'E2ETEST10';

      return request(app.getHttpServer())
        .get(`/coupons/${code}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.code).toBe(code);
        });
    });

    it('should return 404 if coupon not found', () => {
      return request(app.getHttpServer())
        .get('/coupons/INVALID')
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toContain('Coupon not found');
        });
    });
  });

  describe('POST /coupons/:code/validate', () => {
    it('should validate a coupon', () => {
      const code = 'E2ETEST10';
      const validateDto = {
        userId: 'user1',
        purchaseAmount: 100,
      };

      return request(app.getHttpServer())
        .post(`/coupons/${code}/validate`)
        .send(validateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBe(true);
        });
    });

    it('should return 404 if coupon not found', () => {
      const validateDto = {
        userId: 'user1',
        purchaseAmount: 100,
      };

      return request(app.getHttpServer())
        .post('/coupons/INVALID/validate')
        .send(validateDto)
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toContain('Coupon not found');
        });
    });
  });
});
