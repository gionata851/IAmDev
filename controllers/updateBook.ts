import { Request, Response } from "express";
import { Book, Prisma, PrismaClient } from "../generated/prisma";
import { validaPerUpdate } from "../validation/validation";


export const updateBook: (req: Request, res: Response) => void = async (req: Request, res: Response) => {

    try {

        let db: PrismaClient = new PrismaClient();

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

}