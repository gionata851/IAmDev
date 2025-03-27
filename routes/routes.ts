import Express, { Request, Response } from "express";

//import del prisma client e dell'interfaccia Book
import { Book, Prisma, PrismaClient } from "../generated/prisma";

//metodi appositi per la validazione
import { validaPerInsert, validaPerUpdate } from "../validation/validation";

//controllers
import { allBooks } from "../controllers/allBooks";
import { singleBook } from "../controllers/singleBook";
import { insertBooks } from "../controllers/insertBook";
import { updateBook } from "../controllers/updateBook";
import { deleteBook } from "../controllers/deleteBook";


//inizializzo il router
const router = Express.Router();

//inizializzo il prisma client, che è l'oggetto che interroga il database
const db: PrismaClient = new PrismaClient();

//route per avere la lista completa
router.get("/books", allBooks);


//route per avere il libro per ID
router.get("/books/:id", singleBook);

//route per inserire un libro
router.post("/books", insertBooks);

//modifica libro esistente
router.put("/books/:id", updateBook);

//elimina libro
router.delete("/books/:id", deleteBook);

export default router;
