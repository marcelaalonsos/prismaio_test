Start from scratch with prisma.io

1. Create project setup
  - clone repo, cd to directory
  - npm init -y
  - npm install prisma --save-dev
  - npx prisma
  - npx prisma init

2. after npx prisma, you get this:

Prisma is a modern DB toolkit to query, migrate and model your database (https://prisma.io)

Usage

  $ prisma [command]

Commands

            init   Set up Prisma for your app
        generate   Generate artifacts (e.g. Prisma Client)
              db   Manage your database schema and lifecycle
         migrate   Migrate your database
          studio   Browse your data with Prisma Studio
        validate   Validate your Prisma schema
          format   Format your Prisma schema

Flags

     --preview-feature   Run Preview Prisma commands

Examples

  Set up a new Prisma project
  $ prisma init

  Generate artifacts (e.g. Prisma Client)
  $ prisma generate

  Browse your data
  $ prisma studio

  Create migrations from your Prisma schema, apply them to the database, generate artifacts (e.g. Prisma Client)
  $ prisma migrate dev

  Pull the schema from an existing database, updating the Prisma schema
  $ prisma db pull

  Push the Prisma schema state to the database
  $ prisma db push

  Validate your Prisma schema
  $ prisma validate

  Format your Prisma schema
  $ prisma format

3. after npx prisma init, you get this:

Your Prisma schema was created at prisma/schema.prisma
  You can now open it in your favorite editor.

Next steps:
1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
1.a create a database on postgresql
1.b on the .env file define the databse url:
DATABASE_URL='postgresql://postgres:admin@localhost:5432/YOURDATABASENAME?schema=public'

2. Set the provider of the datasource block in schema.prisma to match your database: postgresql, mysql, sqlite, sqlserver, mongodb or cockroachdb.

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

3. Creating a database schema
3.a add data model to prisma/schema.prisma
3.b run npx prisma migrate dev --name init

4. Install and generate Prisma client
npm install @prisma/client

5. Querying the database
Create a new file named index.js and add the following code to it:
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

Here's a quick overview of the different parts of the code snippet:

1. Import the PrismaClient constructor from the @prisma/client node module
2. Instantiate PrismaClient
3. Define an async function named main to send queries to the database
4. Call the main function
5. Close the database connections when the script terminates

Inside the main function, add the following query to read all User records from the database and print the result:

async function main() {
  // ... you will write your Prisma Client queries here
  const allUsers = await prisma.user.findMany()
  console.log(allUsers)
}

run node index.js

This should print an empty array because there are no User records in the database yet

6. Write data into the database
The findMany query you used in the previous section only reads data from the database (although it was still empty). In this section, you'll learn how to write a query to write new records into the Post and User tables.

adjust the main function to send a create query to the database.
async function main() {
  await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io',
      posts: {
        create: { title: 'Hello World' },
      },
      profile: {
        create: { bio: 'I like turtles' },
      },
    },
  })

  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    },
  })
  console.dir(allUsers, { depth: null })
}

This code creates a new User record together with new Post and Profile records using a nested write query. The User record is connected to the two other ones via the Post.author ↔ User.posts and Profile.user ↔ User.profile relation fields respectively.

Notice that you're passing the include option to findMany which tells Prisma Client to include the posts and profile relations on the returned User objects.

Before moving on to the next section, you'll "publish" the Post record you just created using an update query. Adjust the main function as follows:

async function main() {
  const post = await prisma.post.update({
    where: { id: 1 },
    data: { published: true },
  })
  console.log(post)
}

7. Evolving your application
Whenever you make changes to your database that are reflected in the Prisma schema, you need to manually re-generate Prisma Client to update the generated code in the node_modules/.prisma/client directory:
run npx prisma generate
