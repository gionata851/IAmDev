

export const validaPerInsert: (arg0: any) => [boolean, string, string] = (body: any) => {
    let errori = "";
    let warning = "";

    if (!body.title || typeof body.title !== "string" || body.title.trim() == "") {
        errori += "Formato del campo 'title' non valido. Fornire un testo non vuoto. ";
    }

    if (!body.author || typeof body.author !== "string" || body.author.trim() == "") {
        errori += "Formato del campo 'author' non valido. Fornire un testo non vuoto. ";
    }

    let yearOk: boolean = false;
    if (body.year) {
        if (typeof body.year !== "number" || body.year < 1000) {
            warning += "Ignorato il campo 'year', formato non valido. Fornire un numero maggiore o uguale a 1000. "
        }
        else {
            yearOk = true;
        }
    }


    return [yearOk, errori, warning];
}

export const validaPerUpdate: (arg0: any) => [boolean, boolean, boolean, string, string] = (body: any) => {
    let errori = "";
    let warning = "";

    //boolean che indica che avverà la modifica, in quanto almeno un dato è valido.
    let modificaOk: boolean = false;

    //validazione title (stringa non vuota)
    let titleOk: boolean = false;
    if ((body.title)) {
        if (!(typeof body.title === "string") || body.title.trim() == "") {
            warning += "Ignorato il campo 'title', formato non valido. Fornire un testo non vuoto. ";
        }
        else {
            titleOk = true;
        }
    }

    //validazione author (stringa non vuota)
    let authorOk: boolean = false;
    if ((body.author)) {
        if (!(typeof body.author === "string") || body.author.trim() == "") {
            warning += "Ignorato il campo 'author', formato non valido. Fornire un testo non vuoto. ";
        }
        else {
            authorOk = true;
        }
    }

    let yearOk: boolean = false;
    //validazione year (numero maggiore di 1000)
    if ((body.year)) {
        if (!(typeof body.year === "number") || body.year < 1000) {
            warning += "Ignorato il campo 'year', formato non valido. Fornire un numero maggiore o uguale a 1000. ";
        }
        else {
            yearOk = true;
        }
    }

    if (!titleOk && !authorOk && !yearOk) errori += "Non è stato fornito alcun dato valido. Fornire almeno un dato tra: title, author e year";

    return [titleOk, authorOk, yearOk, errori, warning];
}


