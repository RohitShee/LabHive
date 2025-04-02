import express from 'express';
import { adminOnly, protectRoute } from '../middleware/auth.middleware.js';
import { addNewItem, getAllItems, getItem, incrementInstances } from '../controllers/item.controller.js';

const router = express.Router();

router.post("/add",protectRoute,adminOnly,addNewItem);
router.get("/",protectRoute,getAllItems);
router.post("/inc/:id",protectRoute,adminOnly,incrementInstances);
router.get("/:id",protectRoute,getItem);

export default router;