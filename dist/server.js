"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("./db/mongodb");
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const router_1 = __importDefault(require("./routes/router"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: false }));
// app.use(bodyParser.json());
require("dotenv").config();
// console.log(process.env.JWT_SECRET);
app.use("/", router_1.default);
// app.use(bodyParser.json());
(0, mongodb_1.connectDB)();
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Express API for JSONPlaceholder",
        version: "1.0.0",
        description: "This is a REST API application made with Express. It retrieves data from JSONPlaceholder.",
    },
    authAction: {
        JWT: {
            name: "JWT",
            schema: {
                type: "apiKey",
                in: "header",
                name: "Authorization",
                description: "",
            },
            value: "Bearer <JWT>",
        },
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Development server",
        },
    ],
};
const options = {
    swaggerDefinition,
    apis: [`${__dirname}/swagger/*.ts`],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.get("/", (req, res) => {
    res.json({ message: "working fine !! 🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹" });
});
app.get("/health", (req, res) => {
    res.status(200).json({
        message: "Everything is Good 💐💐💐💐💐💐💐 🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹",
        project_name: "Odin_Nodejs Backend",
        dev_name: "Abhaya Kumar Sahoo",
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map