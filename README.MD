# bookfinder

This project is a simple API for storing a book catalogue.

To run it, follow these steps.

0. This project requires node version 22. Be sure to update it from the official site: https://nodejs.org/en
1. Clone this project in a folder of your choice.
2. Launch the **init** script (**npm run init** on the terminal, located in the chosen folder, which is going to be the root of the project). This command installs all the required dependencies.
3. Open the **".env EXAMPLE"** file, and compile it with the required parameters, which are:\
    * DATABASE_URL: the connection string. In the case of SQLite this has to be a string in the following format: "file:./[folder]/[folder].../[database_name].db". SQLite will create the database at the relative path you choose.\
    * PORT: the number of the localhost port the server will expose its APIs.
4. Rename the **".env EXAMPLE"** file canceling "EXAMPLE". Its name has to be **.env**.
5. Launch the **generate** script (**npm run generate** on the terminal, located in the root folder). This script generates the database at the suggested path, according to the connection string written in the .env file. It also populates the database with some test data, and lauches the server.

Now the server is listening and can be queried with the following methods/urls:


GET    | /books      |    → Returns the list of all books.\
GET    | /books/:id  |    → Returns a specific book.\
POST   | /books      |    → Adds a new book.\
PUT    | /books/:id  |    → Updates an existing book.\
DELETE | /books/:id  |    → Deletes a book.

POST and PUT methods require the body created as **raw JSON**. Here's an example.

{
    title : [book title], //required for the insert - must be a non-empty string
    author : [book author's name], //required for the insert - must be a non-empty string
    year : [issue year] //not required for the insert, but when compiled has to be a number greater than 1000
}

When sending a PUT request, you can include only the field that you want to change.

From now on the server can be launched with the **start** script. (**npm run start** on the terminal, located in the root folder).

Happy reading!