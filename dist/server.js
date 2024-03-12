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
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "views")); // Set the views directory
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
const envFile = process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
require("dotenv").config();
console.log("SERVER DATABASE URL", process.env.DATABASE_URL);
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
// console.log(process.env.JWT_SECRET);
app.use("/", router_1.default);
app.use(body_parser_1.default.json());
console.log(process.env.NODE_ENV);
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
    apis: [`${__dirname}/swagger/*`],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.get("/", async (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "public", "home.html"));
});
// app.get("/", (req, res) => {
//   res.json({
//     message:
//       "Everything is Good 🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹 ✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅ 🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹",
//     project_name: "Odin_Nodejs Backend",
//     dev_name: "A.K Sahoo",
//   });
// });
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