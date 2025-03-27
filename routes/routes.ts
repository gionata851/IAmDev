import Express from "express";

//import del prisma client e dell'interfaccia Book
import { Book, Prisma, PrismaClient } from "../generated/prisma";

//metodi appositi per la validazione
import { validaPerInsert, validaPerUpdate } from "../validation/validation";

//inizializzo il router
const router = Express.Router();

//inizializzo il prisma client, che è l'oggetto che interroga il database
const db: PrismaClient = new PrismaClient();

//route per avere la lista completa
router.get("/books", async (req, res) => {
    try {
        //con il metodo prisma estraggo tutti i libri
        let listaLibri: Book[] = await db.book.findMany();

        //se non c'è nessun libro restituisco errore 404
        if (listaLibri.length == 0) {
            res.status(404).json({ msg: "nessun libro presente" });
            return;
        }
        else {
            res.status(200).json(listaLibri);
            return;
        }

    }
    catch (ex) {
        res.status(500).json(ex);
        return;
    }
});

//route per avere il libro per ID
router.get("/books/:id", async (req, res) => {
    try {
        //prelevo l'ID dalla request
        let requestedId: number = parseInt(req.params.id);

        //cerco il libro con il metodo prisma
        let libro: Book | null = await db.book.findUnique(
            {
                where: {
                    id: requestedId
                }
            }
        );

        //senon trovo quell'id restituisco 404
        if (!libro) {
            res.status(404).json({ msg: `nessun libro trovato in corrispondenza dell'Id ${requestedId}` });
            return;
        }
        else { //altrimenti rispondo con il libro trovato        
            res.status(200).json(libro);
            return;
        }
    }
    catch (ex) {
        res.status(500).json(ex);
        return;
    }

});

//route per inserire un libro
router.post("/books", async (req, res) => {

    try {
        //variabili che servono per la validazione
        let yearOk: boolean;
        let error: string = "";
        let warning: string = "";

        //chiamo il metodo apposito di validazione e valorizzo le variabili
        [yearOk, error, warning] = validaPerInsert(req.body);

        //se il metodo ha rilevato errori restituiamo subito bad request 400
        if (error !== "") {
            res.status(400).json({ msg: error });
            return;
        }

        //uso il tipo apposito generato da prisma per creare un oggetto (id non obbligatorio, verrà generato dal db con l'autoincremento)
        let libroDaInserire: Prisma.BookCreateInput = {
            title: req.body.title,
            author: req.body.author,
        }

        //se yearOk valorizzo anche il campo year nell'oggetto che viene salvato.
        if (yearOk) {
            libroDaInserire.year = req.body.year;
        }

        //lancio il metodo prisma per inserire il libro nel database
        const libroCreato: Book = await db.book.create({
            data: libroDaInserire
        })

        //e restituisco risorsa creata 201
        res.status(201).json({
            msg: `Libro inserito con successo con id: ${libroCreato.id}. ${warning !== "" ? " ~ Warning: " + warning : ""}`,
            libroCreato: libroCreato
        });
        return;
    }
    catch (ex) {
        res.status(500).json(ex);
        return;
    }

});

//modifica libro esistente
router.put("/books/:id", async (req, res) => {

    try {

        //prelevo l'ID dalla request
        let requestedId: number = parseInt(req.params.id);

        //verifico l'esistenza
        let libroDaModificare: Book | null = await db.book.findUnique(
            {
                where: {
                    id: requestedId
                }
            }
        );

        //se non esiste restituisco 404
        if (!libroDaModificare) {
            res.status(404).json({ msg: `nessun libro trovato in corrispondenza dell'Id ${requestedId}` });
            return;
        }

        //se siamo qui, il libro esiste.

        //validazione
        let titleOk: boolean, authorOk: boolean, yearOk: boolean;
        let error: string = "";
        let warning: string = "";

        //valorizzo le variabili per la validazione con il metodo apposito
        [titleOk, authorOk, yearOk, error, warning] = validaPerUpdate(req.body);

        //se vi sono errori, restituisco bad request
        if (error !== "") {
            res.status(400).json({ msg: error });
            return;
        }

        //questo è la variabile (modello prisma) apposita per fare l'update
        let libroDatiDaSalvare: Prisma.BookUpdateInput = {};
        //compilo l'oggetto
        if (titleOk) libroDatiDaSalvare.title = req.body.title;
        if (authorOk) libroDatiDaSalvare.author = req.body.author;
        if (yearOk) libroDatiDaSalvare.year = req.body.year;

        //l'operazione di update con la sintassi Prisma
        const libroModificato: Book = await db.book.update({
            where: { id: requestedId },
            data: libroDatiDaSalvare
        })

        //restituisco 201. Se esistenti segnalo i warning.
        res.status(201).json({
            msg: `aggiornamento del libro di id ${requestedId} avvenuta con successo.${warning !== "" ? " ~ Warning: " + warning : ""}`,
            libro: libroModificato
        })
    }
    catch (ex) {
        res.status(500).json(ex);
        return;
    }

});

//elimina libro
router.delete("/books/:id", async (req, res) => {

    try {

        //estraggo l'ID
        let requestedId: number = parseInt(req.params.id);

        //cerco
        let libroDaModificare: Book | null = await db.book.findUnique(
            {
                where: {
                    id: requestedId
                }
            }
        );

        //se non esiste restituisco 404
        if (!libroDaModificare) {
            res.status(404).json({ msg: `nessun libro trovato in corrispondenza dell'Id ${requestedId}` });
            return;
        }

        //elimino con il metodo Prisma
        const libroCancellato = await db.book.delete({
            where: {
                id: requestedId
            }
        })

        //restituisco 200
        res.status(200).json({
            msg: `Cancellazione del libro di id ${requestedId} avvenuta con successo.`,
            libro: libroCancellato
        })
    }
    catch (ex) {
        res.status(500).json(ex);
        return;
    }
});

export default router;
