import express from 'express';
import { addBook, deleteBook, getAllBooks, getBooksByUser } from '../controller/books.controller.js';
import ProtectRoute from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/', ProtectRoute, addBook);
router.get('/', ProtectRoute, getAllBooks);
router.get('/user', ProtectRoute, getBooksByUser);
router.delete('/:id', ProtectRoute, deleteBook);

export default router;
