"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registerController_1 = require("../controllers/registerController");
const loginController_1 = require("../controllers/loginController");
const productController_1 = require("../controllers/productController");
const authentication_1 = require("../middleware/authentication");
const multer_1 = __importDefault(require("multer"));
// const storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, __dirname + "/files");
//   },
//   filename: function (req, file, callback) {
//     // You can write your own logic to define the filename here (before passing it into the callback), e.g:
//     console.log(file.originalname); // User-defined filename is available
//     const filename = `file_${crypto.randomUUID()}`; // Create custom filename (crypto.randomUUID available in Node 19.0.0+ only)
//     callback(null, filename);
//   },
// });
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1048576, // Defined in bytes (1 Mb)
//   },
// });
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
// const upload = multer({ dest: "uploads/" });
const router = express_1.default.Router();
router.post("/register", registerController_1.registerController);
router.post("/login", loginController_1.loginController);
router
    .route("/product/:productId")
    .all(authentication_1.isLogin) // Apply middleware here if needed
    .put(upload.single("image"), productController_1.updateProduct)
    .patch(productController_1.updateProductOrder)
    .get(productController_1.getProductById)
    .delete(productController_1.deleteProduct);
router
    .route("/product")
    .all(authentication_1.isLogin)
    .post(upload.single("image"), productController_1.createProductController)
    .get(productController_1.getProducts);
exports.default = router;
//# sourceMappingURL=router.js.map