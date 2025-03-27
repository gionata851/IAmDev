import { Request, Response } from "express";
import { Book, PrismaClient } from "../generated/prisma";

export const singleBook: (req: Request, res: Response) => void = async (req: Request, res: Response) => {
    try {
        let db: PrismaClient = new PrismaClient();

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

}