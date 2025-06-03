import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { BadRequestError, ForbiddenError } from '../../../utils/errors';

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const { page = '1', limit = '10', search, category, sort } = req.query;
      const products = await this.productService.getAllProducts({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        search: search as string,
        category: category as string,
        sort: sort as string,
      });

      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(parseInt(id));
      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestError('User not authenticated');
      }

      const { name, description, price, category, images } = req.body;
      if (!name || !description || !price || !category) {
        throw new BadRequestError('Missing required fields');
      }

      const product = await this.productService.createProduct({
        name,
        description,
        price,
        category,
        images,
        sellerId: Number(userId),
      });

      res.status(201).json({
        success: true,
        data: product,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestError('User not authenticated');
      }

      const { id } = req.params;
      const product = await this.productService.getProductById(parseInt(id));

      if (product.sellerId !== userId) {
        throw new ForbiddenError('Not authorized to update this product');
      }

      const { name, description, price, category, images } = req.body;
      const updatedProduct = await this.productService.updateProduct(parseInt(id), {
        name,
        description,
        price,
        category,
        images,
      });

      res.status(200).json({
        success: true,
        data: updatedProduct,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestError('User not authenticated');
      }

      const { id } = req.params;
      const product = await this.productService.getProductById(parseInt(id));

      if (product.sellerId !== userId) {
        throw new ForbiddenError('Not authorized to delete this product');
      }

      await this.productService.deleteProduct(parseInt(id));
      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
