// Modules
import colors from 'colors'; // Optional import
import moment from 'moment';
import path from 'path';
import fs from 'fs';
import middleware from './lib/middleware';
import api from './routes/api';
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

// Other inits
cli.set('view engine', 'ejs');
cli.set('trust proxy', true);

// Init middleware
cli.use('/api', api);
cli.use(express.static(path.join(__dirname, '..', 'static')));
middleware.forEach(ext => cli.use(ext));
cli.use(require('express-session')({
    secret: __key,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));


// Websocket
wss.on('connection', (ws:Websocket) => {
    ws.on('message', (message: string) => console.log(message));
});
// Routes
cli.get('/', (req:Request, res:Response) => {
    res.render('index.ejs', {msg:'hey'});
});

cli.get('/test', (req:Request, res:Response) => {
    console.log(req.cookies());
});


// Run
server.listen(port, () => {
    console.log(colors.green(`\n\n\nUp and running at ${colors.blue(startTime)} on http://localhost:${port}`))
});