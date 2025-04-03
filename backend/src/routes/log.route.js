import express from 'express';
import { adminOnly, protectRoute } from '../middleware/auth.middleware';
import { borrowItem, getAllTransactions, getUserTransactions, returnItem } from '../controllers/log.controller.js';

const router = express.Router();

router.get('/',protectRoute,adminOnly,getAllTransactions);
router.post('/borrow',protectRoute,adminOnly,borrowItem);
router.post('/return',protectRoute,adminOnly,returnItem);
router.get('/:id',protectRoute,getUserTransactions);

export default router;