import express from 'express';
import { addBook, addBookbyLink, deleteBook, getAllBooks, getBooksByUser } from '../controller/books.controller.js';
import ProtectRoute from '../middlewares/auth.middleware.js';
import { singleUpload } from '../middlewares/multer.js';
const router = express.Router();

router.post('/', ProtectRoute,singleUpload, addBook);
router.get('/', ProtectRoute, getAllBooks);
router.get('/user', ProtectRoute, getBooksByUser);
router.delete('/:id', ProtectRoute, deleteBook);


router.post('/link', ProtectRoute, addBookbyLink);

export default router;
