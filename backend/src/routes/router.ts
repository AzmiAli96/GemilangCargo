import express from "express";
import { deleteHargaController, getAllHargaController, getHargaController, postHargaController, putHargaController } from "../controller/hargaController";
import { deleteUserController, getAllUsersController, getUsersByIdController, getUsersController, loginController, LogoutController, putUserController, registerController } from "../controller/userController";
import { assignpesananToPengirimanController, deletepesananController, getpesananByIdController, getpesananController, importpesananController, postpesananController, putpesananController } from "../controller/pesananController";
import { upload } from "../middleware/upload";
import { deletepengirimanController, getpengirimanByIdController, getpengirimanController, getpengirimanpaginateController, postpengirimanController, putpengirimanController } from "../controller/pengirimanController";
import { deleteSopirController, getDeliveryPaginateController, getSopirController, postSopirController, putSopirController } from "../controller/sopirController";
import { deleteStatusController, getStatusByIdController, getStatusController, getStatusPaginateController, postStatusController, putStatusController } from "../controller/deliverStatusController";
import { getRoleController } from "../controller/RoleController";
import { deleteTruckController, getTruckController, getTruckPaginateController, postTruckController, putTruckController } from "../controller/truckController";

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
router.get("/harga", getHargaController);
router.get("/allharga", getAllHargaController);
router.post("/harga", postHargaController);
router.put("/harga/:id", putHargaController);
router.delete("/harga/:id", deleteHargaController);

// ================= pesanan =================
router.get("/pesanan", getpesananController);
router.get("/pesanan/:id", getpesananByIdController);
router.post("/pesanan", postpesananController);
router.put("/pesanan/assign-pengiriman", assignpesananToPengirimanController);
router.put("/pesanan/:id", putpesananController);
router.delete("/pesanan/:id", deletepesananController);
router.post("/pesanan/import", upload.single("file"), importpesananController);

// ================= DELIVER Sopir =================
router.get("/sopir", getSopirController);
router.get("/sopirpagination", getDeliveryPaginateController);
router.post("/sopir", postSopirController);
router.put("/sopir/:id", putSopirController);
router.delete("/sopir/:id", deleteSopirController);

// ================= DELIVER Truck =================
router.get("/truck", getTruckController);
router.get("/truckpagination", getTruckPaginateController);
router.post("/truck", postTruckController);
router.put("/truck/:id", putTruckController);
router.delete("/truck/:id", deleteTruckController);

// ================= DELIVER STATUS =================
// router.get("/pengiriman/status", getStatusController);
// router.get("/pengiriman/statuspaginate", getStatusPaginateController);
// router.get("/pengiriman/status/:id", getStatusByIdController);
// router.post("/pengiriman/status", postStatusController);
// router.put("/pengiriman/status/:id", putStatusController);
// router.delete("/pengiriman/status/:id", deleteStatusController);

// ================= DELIVER =================
router.get("/pengiriman", getpengirimanController);
router.get("/pengiriman/:id", getpengirimanByIdController);
router.get("/pengirimanpaginate", getpengirimanpaginateController);
router.post("/pengiriman", postpengirimanController);
router.put("/pengiriman/:id", putpengirimanController);
router.delete("/pengiriman/:id", deletepengirimanController);
// router.get("/pengiriman-summary", getpengirimanSummaryController);





export default router;