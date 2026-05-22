import express from "express";
import { deletePriceController, getAllPriceController, getPriceController, postPriceController, putPriceController } from "../controller/priceController";
import { deleteUserController, getAllUsersController, getUsersByIdController, getUsersController, loginController, LogoutController, putUserController, registerController } from "../controller/userController";
import { assignOrderToDeliveryController, deleteOrderController, getOrderByIdController, getOrderController, importOrderController, postOrderController, putOrderController } from "../controller/orderController";
import { upload } from "../middleware/upload";
import { deleteDeliveryController, getDeliveryByIdController, getDeliveryController, getDeliverypaginateController, getDeliverySummaryController, postDeliveryController, putDeliveryController } from "../controller/deliverController";
import { deleteDriverController, getDeliveryPaginateController, getDriverController, postDriverController, putDriverController } from "../controller/deliverDriverController";
import { deleteStatusController, getStatusByIdController, getStatusController, getStatusPaginateController, postStatusController, putStatusController } from "../controller/deliverStatusController";
import { getRoleController } from "../controller/RoleController";

const router = express.Router();

router.get("/roles", getRoleController);

// ================= USER =================
router.get("/users", getUsersController);
router.get("/allusers", getAllUsersController);
router.post("/login", loginController);
router.post("/logout", LogoutController);
router.post("/register", registerController);
router.get("/users/:id", getUsersByIdController);
router.put("/users/:id", putUserController);
router.delete("/users/:id", deleteUserController);

// ================= PRICE =================
router.get("/price", getPriceController);
router.get("/allprice", getAllPriceController);
router.post("/price", postPriceController);
router.put("/price/:id", putPriceController);
router.delete("/price/:id", deletePriceController);

// ================= ORDER =================
router.get("/order", getOrderController);
router.get("/order/:id", getOrderByIdController);
router.post("/order", postOrderController);
router.put("/order/assign-delivery", assignOrderToDeliveryController);
router.put("/order/:id", putOrderController);
router.delete("/order/:id", deleteOrderController);
router.post("/order/import", upload.single("file"), importOrderController);

// ================= DELIVER DRIVER =================
router.get("/delivery/driver", getDriverController);
router.get("/delivery/driverpagination", getDeliveryPaginateController);
router.post("/delivery/driver", postDriverController);
router.put("/delivery/driver/:id", putDriverController);
router.delete("/delivery/driver/:id", deleteDriverController);

// ================= DELIVER STATUS =================
router.get("/delivery/status", getStatusController);
router.get("/delivery/statuspaginate", getStatusPaginateController);
router.get("/delivery/status/:id", getStatusByIdController);
router.post("/delivery/status", postStatusController);
router.put("/delivery/status/:id", putStatusController);
router.delete("/delivery/status/:id", deleteStatusController);

// ================= DELIVER =================
router.get("/delivery", getDeliveryController);
router.get("/delivery/:id", getDeliveryByIdController);
router.get("/deliverypaginate", getDeliverypaginateController);
router.post("/delivery", postDeliveryController);
router.put("/delivery/:id", putDeliveryController);
router.delete("/delivery/:id", deleteDeliveryController);
router.get("/delivery-summary", getDeliverySummaryController);





export default router;