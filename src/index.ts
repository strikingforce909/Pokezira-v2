// Modules
import colors from 'colors'; // Optional import
import moment from 'moment';
import Websocket from 'ws';
import fs from 'fs';
import http, {
    Server
} from 'http';
import express, {
    Application,
    Request,
    Response,
    NextFunction
} from 'express';

// Variables
const cli:Application    = express(),
      server: Server     = http.createServer(cli),
      wss                = new Websocket.Server({ server }),
      startTime:string   = moment().format(),
      port:number|string = process.env.PORT||5000;

// Middleware
const logs = (req:Request, res:Response, next:NextFunction) => {
    const url: string = colors.blue(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
    console.log(`${colors.red(req.method)} Request on ${url} at ${colors.yellow(moment().format())}`);
    next();
};

// Init the middleware
cli.use(logs);
cli.use(require('express-session')({
    secret: fs.readFileSync(`${__dirname}/secrets/key.secret`),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));


// Websocket
wss.on('connection', (ws: WebSocket) => {
    console.log('A client has connected')
});
// Routes
cli.get('/', (req:Request, res:Response) => res.send(`<b>HEYO</b>`));

cli.get('/test', (req:Request, res:Response) => {
    console.log(req.cookies());
});

// Run
server.listen(port, () => {
    console.log(colors.green(`\n\n\nUp and running at ${colors.blue(startTime)} on port ${colors.blue(""+port)}`))
});