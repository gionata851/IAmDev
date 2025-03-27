import { NextFunction, Request, Response } from "express";

export const logger: (req: Request, res: Response, next: NextFunction) => void = (req, res, next) => {
    console.log(`Chiamata con verbo ${req.method}`);
    console.log(`Parametri ${JSON.stringify(req.params)}`);
    console.log(`Body: ${JSON.stringify(req.body)}`);
    next();
};