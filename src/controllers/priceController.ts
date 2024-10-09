import { UpdateDetails, priceDb } from '@/database/pricedb';
import { NextFunction, Request, Response } from 'express';

const priceController = {
  // extract base url from url and selector
  async saveBaseUrl(req: Request, res: Response, next: NextFunction) {
    const url = req.body.url as string;
    const selector = req.body.selector as string;
    const regex = /^(https?:\/\/[^/]+)/;
    const matchedUrl: RegExpMatchArray | null = url.match(regex);

    if (!matchedUrl) {
      return next({
        log: 'From priceController.saveBaseUrl. Cannot parse the base URL',
        status: 500,
        message: 'Cannot parse the base URL',
      });
    }

    const baseUrl = matchedUrl[0];

    const hasBaseUrl = await priceDb.hasBaseUrl(baseUrl);

    if ('code' in hasBaseUrl) {
      return next({
        log: 'From priceController.saveBaseUrl. Error querying the database.',
        status: 500,
        message: 'Error querying the database.',
      });
    }

    if (hasBaseUrl.length) {
      const updateBaseUrlRes = await priceDb.updateBaseUrl(baseUrl, selector);
      if ('code' in updateBaseUrlRes) {
        return next({
          log: 'From priceController.saveBaseUrl. Error updating the base URL in the database.',
          status: 500,
          message: 'Error updating the base URL in the database.',
        });
      }
    } else {
      const saveBaseUrlRes = await priceDb.createBaseUrl(baseUrl, selector);

      if ('code' in saveBaseUrlRes) {
        return next({
          log: 'From priceController.saveBaseUrl. Error saving the base URL to the database.',
          status: 500,
          message: 'Error saving the base URL to the database.',
        });
      }
    }

    return next();
  },

  async newTrackedItem(req: Request, res: Response, next: NextFunction) {
    const { url, selector, username, user_note, price, target_price } =
      req.body;

    if (!url || !selector || !username || !price || !target_price) {
      return next({
        log: 'From priceController.newTrackedItem. Missing required fields.',
        status: 500,
        message: 'Missing required fields.',
      });
    }

    const response = await priceDb.newTrackedItem(
      url,
      selector,
      username,
      user_note || '',
      price,
      target_price
    );

    if ('code' in response) {
      return next({
        log: 'From priceController.newTrackedItem. Error saving new tracked item to the database.',
        status: 500,
        message: 'Error saving new tracked item to the database.',
      });
    }

    return next();
  },

  async getProducts(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params;
    const response = await priceDb.getProducts(username);

    if ('code' in response) {
      return next({
        log: 'From priceController.getProducts. Error retrieving products from the database.',
        status: 500,
        message: 'Error retrieving products from the database.',
      });
    }

    res.locals.data = response;

    return next();
  },
  // //selector price and timestamp
  // async savePrice(req: Request, res: Response, next: NextFunction) {
  //   const price = res.locals.price as number;
  //   const url = res.locals.url as string;
  //   const timestamp = Date.now();
  //   //update table with price, url and timestamp
  // },
  async updateProducts(req: Request, res: Response, next: NextFunction) {
    const { username, url, user_note, target_price, notify } = req.body;
    const updates: UpdateDetails[] = [];

    if (user_note !== undefined) {
      updates.push({ field: 'user_note', value: user_note });
    }
    if (target_price !== undefined) {
      updates.push({ field: 'target_price', value: target_price });
    }
    if (notify !== undefined) {
      updates.push({ field: 'notify', value: notify });
    }
    if (updates.length === 0) {
      res.status(400).send({ message: 'No updates provided' });
      return;
    }

    // const sql = `UPDATE user_products SET ${updates.join(', ')} WHERE username = $${updates.length + 1} AND url = $${updates.length + 2}`;
    // Adding username and url at the end for WHERE condition
    // const fieldsToUpdate = { user_note, target_price };
    // const params: UpdateQueryParams = {
    //   fields: fieldsToUpdate,
    //   baseParams: [username, url],
    //   tableName: 'user_products',
    //   whereClause: ['username = $1', 'url = $2'],
    // };

    const response = await priceDb.updateProductInfo(username, url, updates);

    if ('code' in response) {
      return next({
        log: 'From priceController.updateProducts. Error updating the database.',
        status: 500,
        message: 'Error updating the database.',
      });
    }

    res.locals.data = response;

    return next();
  },

  async deleteTrackedProduct(req: Request, res: Response) {
    const { username, url } = req.body;

    console.log(req.body);

    if (typeof username !== 'string' && typeof url !== 'string') {
      res.status(400).json({
        message: 'Please provide a username and url',
        error: 'Missing required data',
      });
      return;
    }

    // validate that the url exists under the user
    const userHasUrl = await priceDb.validateUserHasUrl(username, url);

    if ('code' in userHasUrl) {
      console.error(userHasUrl.message);
      res.status(500).json({
        message: 'Error querying the database',
        error: userHasUrl.message,
      });
      return;
    }

    if (Array.isArray(userHasUrl) && userHasUrl[0].count < 1) {
      res.status(400).json({
        message: 'The user does not have this user',
        error: 'Invalid url',
      });
      return;
    }

    const deleteProductResponse = await priceDb.deleteTrackedItem(
      username,
      url
    );

    if ('code' in deleteProductResponse) {
      console.error(deleteProductResponse);
      res.status(500).json({
        message: 'Error deleting the url from the database',
        error: deleteProductResponse.message,
      });
      return;
    }

    res.json({
      message: 'Successfully deleted product from user',
    });
  },

  //   async deleteProducts(req: Request, res: Response) {
  //     const { username, url } =
  //   }
  //   // //save to fourth table

  // add method to check fetch and update database use fetch
};

export { priceController };
