import express, {
    Application,
    Router,
    Request,
    Response,
    NextFunction,
} from 'express';

const ext      = express.Router(),
      pokebase = require('../../json/pokebase.json')

ext.get('/pokebase.api.json', (req: Request, res: Response) => res.json(pokebase));

export default ext;
