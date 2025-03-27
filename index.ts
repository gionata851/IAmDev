//express
import express from "express";
//package "dotenv" che permette di leggere il file .env
import * as dotenv from "dotenv"
//il router creato appositamente
import router from "./routes/routes";


//inizializzazione di dotenv, necessario per leggere il file .env
dotenv.config();

//la porta letta nel file .env
const port: number = parseInt(process.env.PORT || "8000");

//inizializzazione di express
const app = express();

//middleware per gestire raw json nel body della request
app.use(express.json({}));

//aggiunta del middleware router (per ulteriori info consultare routes/routes.ts)
//Utile perchè così le dipendenze relative all'ORM Prisma e ai modelli le metto solo nel file routes.
app.use(router);

//aggiungo qui un middleware perchè se il router non ha funzionato devo restituire un errore di indirizzo non valido
app.use((req, res) => {
    res.status(404).json({
        msg: "Indirizzo non valido"
    })
});

//lancio del server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})