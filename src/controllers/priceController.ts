import { Request, Response, NextFunction } from 'express';
//import { url } from 'inspector';
import { priceDb } from '@/database/pricedb';
import { UpdateQueryParams } from '@/utils/sqlHelpers';

const priceController = {
  // //extract base url from url and selector
  async saveBaseUrl(req: Request, res: Response, next: NextFunction) {
    const url = req.body.url as string;
    const selector = req.body.selector as string;
    const regex = /^(https?:\/\/[^\/]+)/;
    const matchedUrl: RegExpMatchArray | null = url.match(regex);
    if (matchedUrl) {
      const baseUrl = matchedUrl[0];
      try {
        const result = await priceDb.createBaseUrl(baseUrl, selector);
        res.json(result);
      } catch (error) {
        console.error('Error saving to the database:', error);
        next(error);
      }
    } else {
      console.log('No base URL found');
      const error = new Error('No base URL');
      next(error);
    }
  },
  async newTrackedItem(req: Request, res: Response, next: NextFunction) {
    try {
      // const url = res.locals.url as string;
      // const selector = res.locals.selector as string;
      const { url, selector, username, user_note, price, target_price } =
        req.body;

      const result = await priceDb.newTrackedItem(
        url,
        selector,
        username,
        user_note,
        price,
        target_price
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async getProducts(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params;
    const result = await priceDb.getProducts(username);
    if (!result.length) {
      return next();
    }

    console.log(result);
    res.locals.data = result;
    next();
  },
  // //selector price and timestamp
  // async savePrice(req: Request, res: Response, next: NextFunction) {
  //   const price = res.locals.price as number;
  //   const url = res.locals.url as string;
  //   const timestamp = Date.now();
  //   //update table with price, url and timestamp
  // },
  async updateProducts(req: Request, res: Response) {
    const { username, url, user_note, target_price } = req.body;
    const fieldsToUpdate = { user_note, target_price };
    const params: UpdateQueryParams = {
      fields: fieldsToUpdate,
      baseParams: [username, url],
      tableName: 'user_products',
      whereClause: ['username = $1', 'url = $2'],
    };

    try {
      await priceDb.updateProduct(params);
      res.json({ message: 'Product info updated successfully' });
    } catch (error) {
      console.error('Failed to update product info:', error);
      res.status(500).json({ error: 'Failed to update product information' });
    }
  },

  //   async deleteProducts(req: Request, res: Response) {
  //     const { username, url } =
  //   }
  //   // //save to fourth table

  // add method to check fetch and update database use fetch
};

export { priceController };
