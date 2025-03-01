import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

const productService = new ProductService();

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      category, 
      minPrice, 
      maxPrice, 
      availability, 
      minRating, 
      sortBy, 
      sortOrder 
    } = req.query;

    const products = await productService.getAll({
      category: category ? Number(category) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      availability: availability === 'inStock' ? true : availability === 'outOfStock' ? false : undefined,
      minRating: minRating ? Number(minRating) : undefined,
      sortBy: sortBy as 'price' | 'createdAt' | 'popularity',
      sortOrder: sortOrder as 'ASC' | 'DESC',
    });

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};