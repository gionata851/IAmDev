import { Request, Response } from "express";
import { validaPerInsert } from "../validation/validation";
import { Book, Prisma, PrismaClient } from "../generated/prisma";

export const insertBooks: (req: Request, res: Response) => void = async (req: Request, res: Response) => {

    try {

        let db: PrismaClient = new PrismaClient();

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

}