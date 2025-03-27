import { Request, Response } from "express";
import { Book, PrismaClient } from "../generated/prisma";

export const allBooks: (req: Request, res: Response) => void = async (req: Request, res: Response) => {
    try {
        let db: PrismaClient = new PrismaClient();

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
}