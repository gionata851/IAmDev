import { PrismaClient } from "./generated/prisma";

let db: PrismaClient = new PrismaClient();

(async function dataseed() {

    const result = await db.book.createMany({
        data: [
            {
                "title": "1984",
                "author": "George Orwell",
                "year": 1948
            },
            {
                "title": "L'Insostenibile Leggerezza Dell'Essere",
                "author": "Milan Kundera",
                "year": 1984
            },
            {
                "title": "Il Deserto dei Tartari",
                "author": "Dino Buzzati",
                "year": 1940
            }
        ]
    })

    console.log(result);
})();

