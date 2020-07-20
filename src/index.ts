// Modules
import colors from 'colors'; // Optional import
import moment from 'moment';
import path from 'path';
import fs from 'fs';
import Websocket, {
    Server as Serve
} from 'ws';
import http, {
    Server
} from 'http';
import showdown, {
    Converter
} from 'showdown';
import express, {
    Application,
    Request,
    Response,
    NextFunction
} from 'express';

// Variables
const cli:Application    = express(),
      server:Server      = http.createServer(cli),
      wss:Serve            = new Websocket.Server({ server }),
      pokebase:object    = require('../json/pokebase.json'),
      startTime:string   = moment().format(),
      markdown:Converter = new showdown.Converter(),
      port:number|string = process.env.PORT||5000;
let __key:String|Buffer;
try {
    __key = fs.readFileSync(path.join(__dirname, '..', 'secrets', 'key.secret'))
} catch(err) {
    // Local
    __key = 'SUPER SECRETT';
}

// Middleware
const logs = (req:Request, res:Response, next:NextFunction) => {
    const url:string = colors.blue(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
    let code:string
    console.log(`A ${colors.red(req.method)} request was to ${url} at ${colors.yellow(moment().format())}`);
    next();
};

// Other inits


cli.set('view engine', 'ejs');

// Init the middleware
cli.use(logs);
cli.use(require('express-session')({
    secret: __key,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));


// Websocket
wss.on('connection', (ws:WebSocket) => {
    console.log('A client has connected')
});
// Routes
cli.get('/', (req:Request, res:Response) => {
    res.render('index.ejs', {msg:'hey'});
});

cli.get('/test', (req:Request, res:Response) => {
    console.log(req.cookies());
});

cli.get('/pokebase.json', (req:Request, res:Response) => res.json(pokebase));


// Run
console.log(markdown.makeHtml('**lol**'));
server.listen(port, () => {
    console.log(colors.green(`\n\n\nUp and running at ${colors.blue(startTime)} on port ${colors.blue(""+port)}`))
});