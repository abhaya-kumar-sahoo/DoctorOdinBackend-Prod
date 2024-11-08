import express from "express";
import * as userController from "../controllers/ReportController";
import * as tagController from "../controllers/tagController";
import * as conductTestController from "../controllers/conductTestController";
import { registerController } from "../controllers/registerController";
import * as forgetPassword from "../controllers/forgetPasswordController";
import { loginController } from "@Odin/controllers/loginController";
import {
  createProductController,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
  updateProductOrder,
} from "@Odin/controllers/productController";
import { isLogin } from "@Odin/middleware/authentication";
import multer from "multer";
import { getMyProfile } from "@Odin/controllers/UserController";
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
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post("/register", registerController);

router.post("/login", loginController);

router
  .route("/product/:productId")
  .all(isLogin)
  .put(upload.single("image"), updateProduct)
  .patch(updateProductOrder)
  .get(getProductById)
  .delete(deleteProduct);

router
  .route("/product")
  .all(isLogin)
  .post(upload.single("image"), createProductController)
  .get(getProducts);

router.get("/my_profile", isLogin, getMyProfile);

router.post("/addrecord", isLogin, userController.addRecord);
router.get("/gethistory", isLogin, userController.getHistory);
router.get(
  "/getHistoryByDeviceId",
  isLogin,
  userController.getHistoryByDeviveId
);
router.get(
  "/generateReportForSingleInstrument",
  isLogin,
  userController.generateReportForSingleInstrument
);
router.get(
  "/generateReportOfMultipleInstrument",
  isLogin,
  userController.generateReportOfMultipleDevice
);

router.post("/addtag", isLogin, tagController.addTag);
router.get("/getAllTagsByUserId", isLogin, tagController.getAllTagsByUserId);
// testApi Endpoints
router.post("/addTest", isLogin, conductTestController.createTest);
router.get("/getTests", isLogin, conductTestController.getAllTests);
router.get("/getTest/:id", isLogin, conductTestController.getTestById);
router.patch("/updateTest/:id", isLogin, conductTestController.updateTest);
router.delete("/deleteTest/:id", isLogin, conductTestController.deleteTest);

//  forget password api
router.post(
  "/forgetPassword",
  isLogin,
  forgetPassword.sendOtpForForgetPassword
);
router.post("/updatePassword", isLogin, forgetPassword.updatePassword);
export default router;
