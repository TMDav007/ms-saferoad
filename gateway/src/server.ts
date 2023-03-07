import express from "express";
import cors from "cors";
import helmet from "helmet";
import proxy from "express-http-proxy";

const app = express();

app
    .use(helmet())
    .use(cors());


app.use('/ticket', proxy('http://localhost:1338'))
app.use('/', proxy('http://localhost:1337')) //auth

app.listen(1335, () => {
    console.log('Gateway server is running on Port 1335')
})