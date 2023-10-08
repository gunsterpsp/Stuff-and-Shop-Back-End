import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import ShoppingCartRoute from "./routes/ShoppingCartRoute.js";
import CategoryItems from "./routes/CategoryItemRoute.js";
import fileUpload from "express-fileupload";
import NotifcationRoute from "./routes/NotificationRoute.js";
import MessengerRoute from "./routes/MessengerRoute.js";
import MessengerDetails from "./models/MessengerDetailsModel.js";
// import http from 'http';
// import { Server as SocketIOServer } from 'socket.io';
import {createServer} from "http";
import { Server } from "socket.io";


dotenv.config();


const app = express();
// const server = http.createServer(app);
// const io = new SocketIOServer(server);
app.use(cors({
    credentials: true,
    origin: process.env.ORIGIN,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));



const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        credentials: true,
        origin: process.env.ORIGIN,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        allowedHeaders: ['Content-Type'],
    }
});


// Listen for incoming connections
io.on('connection', (socket) => {

    // console.log('A user connected');
  
    socket.on('updateComponent', () => {
      io.emit('refreshComponent');
    });
  
    socket.on('disconnect', () => {
    //   console.log('A user disconnected');
    });
});


app.use(fileUpload());
const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});

app.use("/images", express.static(`images`));

// (async()=>{
//     await db.sync();
// })();
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
    rolling: false,
    cookie: {
        secure: 'auto',
        maxAge: 1000 * 60 * 60 * 24
    }
}));


// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     next();
// });
app.use(express.json());
app.use(UserRoute);
app.use(ProductRoute);
app.use(AuthRoute);
app.use(ShoppingCartRoute);
app.use(CategoryItems);
app.use(NotifcationRoute);
app.use(MessengerRoute);

// store.sync();

httpServer.listen(process.env.APP_PORT, ()=> {
    console.log('Server up and running on port',process.env.APP_PORT);
});
