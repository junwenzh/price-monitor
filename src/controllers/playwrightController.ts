import { playwrightConnection } from '@/utils/playwright';
import { Request, Response } from 'express';

class PlaywrightController {
  async getScreenshot(req: Request, res: Response) {
    const url = res.locals.url as string;
    if (!url) {
    }

    const page = await playwrightConnection.getPage(url);
  }
  async getElementAtXY(req: Request, res: Response) {}
}

export default new PlaywrightController();
