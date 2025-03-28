import Express from "express";


//controllers
import { allBooks } from "../controllers/allBooks";
import { singleBook } from "../controllers/singleBook";
import { insertBook } from "../controllers/insertBook";
import { updateBook } from "../controllers/updateBook";
import { deleteBook } from "../controllers/deleteBook";

//inizializzo il router
const router = Express.Router();

//route per avere la lista completa
router.get("/books", allBooks);


//route per avere il libro per ID
router.get("/books/:id", singleBook);

//route per inserire un libro
router.post("/books", insertBook);

//modifica libro esistente
router.put("/books/:id", updateBook);

//elimina libro
router.delete("/books/:id", deleteBook);

export default router;
