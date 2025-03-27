import { Request, Response } from "express";
import { Book, PrismaClient } from "../generated/prisma";


export const deleteBook = async (req: Request, res: Response) => {

    try {

        let db: PrismaClient = new PrismaClient();

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
}