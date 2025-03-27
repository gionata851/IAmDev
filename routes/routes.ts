import Express from "express";

//import del prisma client e dell'interfaccia Book
import { Book, Prisma, PrismaClient } from "../generated/prisma";
import { IBookInsert } from "../models/IBookInsert";
import { validaPerInsert } from "../validation/validation";

//inizializzo il router
const router = Express.Router();

//inizializzo il prisma client, che è l'oggetto che interroga il database
const db: PrismaClient = new PrismaClient();

//route per avere la lista completa
router.get("/books", async (req, res) => {
    let listaLibri: Book[] = await db.book.findMany();

    if (listaLibri.length == 0) {
        res.status(404).json({ msg: "nessun libro presente" });
        return;
    }
    else {
        res.status(200).json(listaLibri);
        return;
    }
});



//route per avere il libro per ID
router.get("/books/:id", async (req, res) => {

    let requestedId: number = parseInt(req.params.id);
    let libro: Book | null = await db.book.findUnique(
        {
            where: {
                id: requestedId
            }
        }
    );

    if (!libro) {
        res.status(404).json({ msg: `nessun libro trovato in corrispondenza dell'Id ${requestedId}` });
        return;
    }
    else {
        res.status(200).json(libro);
        return;
    }
});

router.post("/books", async (req, res) => {



    // //controllo sul titolo
    // let title: string = req.body.title;
    // if (!title || title.trim() === "") {
    //     res.status(400).json({ msg: "fornire un titolo del libro" });
    //     return;
    // }

    // //controllo sull'autore
    // let author: string = req.body.author;
    // if (!author || author.trim() === "") {
    //     res.status(400).json({ msg: "fornire un autore del libro" });
    //     return;
    // }

    // //l'anno non lo controllo perchè opzionale
    // let year: number | undefined = parseInt(req.body.year);

    let error: string = "";
    let warning: string = "";

    [error, warning] = validaPerInsert(req.body);

    if (error !== "") {
        res.status(400).json({ msg: error });
        return;
    }



    //uso il tipo apposito generato da prisma per creare un oggetto (id non obbligatorio, verrà generato dal db con l'autoincremento)
    let libroDaInserire: Prisma.BookCreateInput = {
        title: req.body.title,
        author: req.body.author,
    }

    //in questo caso l'unico warning possibile riguarda il campo year, quindi semplifico così. Se c'erano più campi, andava usato un sistema più strutturato, ad esempio degli errori custom con dei codici
    if (warning === "") {
        libroDaInserire.year = req.body.year;
    }

    const libroCreato: Book = await db.book.create({
        data: libroDaInserire
    })

    res.status(201).json({
        msg: `Libro inserito con successo con id: ${libroCreato.id}. ${warning !== "" ? " ~ Warning: " + warning : ""}`,
        libroCreato: libroCreato
    });
    return;

});

//modifica libro esistente
router.put("/books/:id", async (req, res) => {
    let requestedId: number = parseInt(req.params.id);
    let libroDaModificare: Book | null = await db.book.findUnique(
        {
            where: {
                id: requestedId
            }
        }
    );

    if (!libroDaModificare) {
        res.status(404).json({ msg: `nessun libro trovato in corrispondenza dell'Id ${requestedId}` });
        return;
    }

    //se siamo qui, il libro esiste.

    //questo è la variabile (modello prisma) per fare l'update
    let libroDatiDaSalvare: Prisma.BookUpdateInput = {};



    //Valido i campi che trovo, se non validi li ignoro e visualizzo un warning.
    let warningMessage = "";

    //validazione title (stringa non vuota)
    if ((req.body.title)) {
        if (!(typeof req.body.title === "string") || req.body.title.trim() == "") warningMessage += "Ignorato il campo 'title', formato non valido. Fornire un testo non vuoto. ";
        else libroDatiDaSalvare.title = req.body.title;
    }

    //validazione author (stringa non vuolta)
    if ((req.body.author)) {
        if (!(typeof req.body.author === "string") || req.body.author.trim() == "") warningMessage += "Ignorato il campo 'author', formato non valido. Fornire un testo non vuoto. ";
        else libroDatiDaSalvare.author = req.body.author;
    }

    //validazione year (numero maggiore di 1000)
    if ((req.body.year)) {
        if (!(typeof req.body.year === "number") || req.body.year < 1000) warningMessage += "Ignorato il campo 'year', formato non valido. Fornire un numero maggiore o uguale a 1000. ";
        else libroDatiDaSalvare.year = req.body.year;
    }

    //se nessun campo era valido, restituiamo errore
    if (Object.keys(libroDatiDaSalvare).length === 0) {
        res.status(400).json({ msg: "Non è stato fornito alcun dato valido. Fornire almeno un dato tra: title, author e year" });
        return;
    }

    //l'operazione di update con la sintassi prisma
    const libroModificato: Book = await db.book.update({
        where: { id: requestedId },
        data: libroDatiDaSalvare
    })

    res.status(201).json({
        msg: `aggiornamento del libro di id ${requestedId} avvenuta con successo.${warningMessage !== "" ? " ~ Warning: " + warningMessage : ""}`,
        libro: libroModificato
    })

});

router.delete("/books/:id", async (req, res) => {

    let requestedId: number = parseInt(req.params.id);
    let libroDaModificare: Book | null = await db.book.findUnique(
        {
            where: {
                id: requestedId
            }
        }
    );

    if (!libroDaModificare) {
        res.status(404).json({ msg: `nessun libro trovato in corrispondenza dell'Id ${requestedId}` });
        return;
    }

    const libroCancellato = await db.book.delete({
        where: {
            id: requestedId
        }
    })

    res.status(200).json({
        msg: `Cancellazione del libro di id ${requestedId} avvenuta con successo.`,
        libro: libroCancellato
    })



});

export default router;
