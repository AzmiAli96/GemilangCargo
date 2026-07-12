import express from "express";
import { deleteHargaController, getAllHargaController, getHargaController, postHargaController, putHargaController } from "../controller/hargaController";
import { deleteUserController, getAllUsersController, getSopirController, getUsersByIdController, getUsersController, loginController, LogoutController, putUserController, registerController } from "../controller/userController";
import { assignpesananToPengirimanController, deletepesananController, getAllPesananController, getpesananByIdController, getpesananController, importpesananController, postpesananController, putpesananController } from "../controller/pesananController";
import { upload } from "../middleware/upload";
import { deletepengirimanController, generatePengirimanController, getpengirimanByIdController, getpengirimanController, getpengirimanpaginateController, postpengirimanController, putpengirimanController } from "../controller/pengirimanController";
import { deleteStatusController, getStatusByIdController, getStatusController, getStatusPaginateController, postStatusController, putStatusController } from "../controller/deliverStatusController";
import { getRoleController } from "../controller/RoleController";
import { deleteTruckController, getTruckAdaController, getTruckController, getTruckPaginateController, postTruckController, putTruckController } from "../controller/truckController";
import { deletePengeluaranController, getPengeluaranByIdController, getPengeluaranController, getPengeluaranPaginateController, postPengeluaranController, putPengeluaranController } from "../controller/pengeluaranController";
import { exportLaporanBulananController, getLaporanBulananController, getLaporanPaginateController, getLaporanRingkasanBulananController } from "../controller/laporanController";

const router = express.Router();

router.get("/roles", getRoleController);

// ================= USER =================
router.get("/users", getUsersController);
router.get("/allusers", getAllUsersController);
router.get("/sopir", getSopirController)
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
router.get("/allPesanan", getAllPesananController);
router.get("/pesanan", getpesananController);
router.get("/pesanan/:id", getpesananByIdController);
router.post("/pesanan", postpesananController);
router.put("/pesanan/assign-pengiriman", assignpesananToPengirimanController);
router.put("/pesanan/:id", putpesananController);
router.delete("/pesanan/:id", deletepesananController);
router.post("/pesanan/import", upload.single("file"), importpesananController);

// ================= DELIVER Truck =================
router.get("/truck", getTruckController);
router.get("/truckpagination", getTruckPaginateController);
router.get("/truck-ada", getTruckAdaController);
router.post("/truck", postTruckController);
router.put("/truck/:id", putTruckController);
router.delete("/truck/:id", deleteTruckController);

// ================= DELIVER =================
router.get("/pengiriman", getpengirimanController);
router.get("/pengiriman/:id", getpengirimanByIdController);
router.get("/pengirimanpaginate", getpengirimanpaginateController);
router.post("/pengiriman", postpengirimanController);
router.put("/pengiriman/:id", putpengirimanController);
router.delete("/pengiriman/:id", deletepengirimanController);
router.post("/pengiriman/generate", generatePengirimanController);
// router.get("/pengiriman-summary", getpengirimanSummaryController);

// ================= DELIVER PENGELUARAN =================
router.get("/pengeluaran", getPengeluaranController);
router.get("/pengeluaranpaginate", getPengeluaranPaginateController);
router.get("/pengeluaran/:id", getPengeluaranByIdController);
router.post("/pengeluaran", postPengeluaranController);
router.put("/pengeluaran/:id", putPengeluaranController);
router.delete("/pengeluaran/:id", deletePengeluaranController);

// ================= DELIVER Sopir =================
router.get("/laporan/bulanan", getLaporanBulananController);
router.get("/laporan/paginate", getLaporanPaginateController);
router.get("/laporan/export-bulanan", exportLaporanBulananController);
router.get("/laporan/ringkasan-bulanan", getLaporanRingkasanBulananController);

// ================= DELIVER Sopir =================
// router.get("/sopir", getSopirController);
// router.get("/sopirpagination", getDeliveryPaginateController);
// router.post("/sopir", postSopirController);
// router.put("/sopir/:id", putSopirController);
// router.delete("/sopir/:id", deleteSopirController);

// ================= DELIVER STATUS =================
// router.get("/pengiriman/status", getStatusController);
// router.get("/pengiriman/statuspaginate", getStatusPaginateController);
// router.get("/pengiriman/status/:id", getStatusByIdController);
// router.post("/pengiriman/status", postStatusController);
// router.put("/pengiriman/status/:id", putStatusController);
// router.delete("/pengiriman/status/:id", deleteStatusController);



export default router;