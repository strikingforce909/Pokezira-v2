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
      pokebase: object   = require('../json/pokebase.json'),
      startTime:string   = moment().format(),
      port:number|string = process.env.PORT||5000;

// Middleware
const logs = (req:Request, res:Response, next:NextFunction) => {
    const url: string = colors.blue(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
    let code:string
    if (req.statusCode === 200) {code = colors.green(""+req.statusCode)} else {code = colors.red(""+req.statusCode)} 
    console.log(`A ${colors.red(req.method)} request was made at ${url} and got ${code} status code at ${colors.yellow(moment().format())}`);
    next();
};
cli.engine('sqrl', require('squirrelly').renderFile)
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
cli.get('/', (req:Request, res:Response) => {
    res.render('index')
});

cli.get('/test', (req:Request, res:Response) => {
    console.log(req.cookies());
});

cli.get('/pokebase.json', (req:Request, res:Response) => res.json(pokebase));


// Run
server.listen(port, () => {
    console.log(colors.green(`\n\n\nUp and running at ${colors.blue(startTime)} on port ${colors.blue(""+port)}`))
});