import express from "express";
import Router from "./router";

const router = express.Router();

// prefix /api
router.use("/api", Router);

// optional test
router.get("/", (req, res) => {
    res.send("Hello World");
});

router.get("/test", (req, res) => {
    res.send("Berhasil Bro");
});

export default router;