export const validaPerInsert: (arg0: any) => [string, string] = (body: any) => {
    let errori = "";
    let warning = "";

    if (!body.title || typeof body.title !== "string" || body.title.trim() == "") {
        errori += "Formato del 'title' non valido. Fornire un testo non vuoto. ";
    }

    if (!body.author || typeof body.author !== "string" || body.author.trim() == "") {
        errori += "Formato del 'author' non valido. Fornire un testo non vuoto. ";
    }

    if (body.year) {
        if (typeof body.year !== "number" || body.year < 1000) {
            warning += "Ignorato il campo 'year', formato non valido. Fornire un numero maggiore o uguale a 1000. "
        }
    }


    return [errori, warning];
}

export const validaPerUpdate: (arg0: any) => [string, string] = (body: any) => {
    let errori = "";
    let warning = "";

    //boolean che indica che avverà la modifica, in quanto almeno un dato è valido.
    let modificaOk: boolean = false;

    //validazione title (stringa non vuota)
    if ((body.title)) {
        if (!(typeof body.title === "string") || body.title.trim() == "") {
            warning += "Ignorato il campo 'title', formato non valido. Fornire un testo non vuoto. ";
        }
        else {
            modificaOk = true;
        }
    }

    //validazione author (stringa non vuolta)
    if ((body.author)) {
        if (!(typeof body.author === "string") || body.author.trim() == "") {
            warning += "Ignorato il campo 'author', formato non valido. Fornire un testo non vuoto. ";
        }
        else {
            modificaOk = true;
        }
    }

    //validazione year (numero maggiore di 1000)
    if ((body.year)) {
        if (!(typeof body.year === "number") || body.year < 1000) {
            warning += "Ignorato il campo 'year', formato non valido. Fornire un numero maggiore o uguale a 1000. ";

        }
        else {
            modificaOk = true;
        }
    }

    if (!modificaOk) errori += "Non è stato fornito alcun dato valido. Fornire almeno un dato tra: title, author e year";

    return [errori, warning];
}