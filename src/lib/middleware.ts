import colors from 'colors';
import moment from 'moment';
import {
    Request,
    Response,
    NextFunction
} from 'express';

export default [
    (req:Request, res:Response, next:NextFunction) => {
        next();
    },
    (req:Request, res:Response, next:NextFunction) => {
        const url:string = colors.blue(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
        let code:string
        console.log(`A ${colors.red(req.method)} request was to ${url} at ${colors.yellow(moment().format())} by ${req.ip}`);
        next();
    }
]