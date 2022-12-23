const { PrismaClient } = require("@prisma/client"); //import the PrismaClient constructor from the @prisma/client node module

const prisma = new PrismaClient(); //instantiate PrismaClient

//define an async function named main to send queries to the database
async function main() {
  // you will write your Prisma Client queries here
  // const post = await prisma.post.update({
  //   where: { id: 1 },
  //   data: { published: true },
  // });
  // console.log(post);
  await prisma.user.create({
    data: {
      name: "Marcela",
      email: "marcela@prisma.io",
      posts: {
        create: { title: "Learning Prisma" },
      },
      profile: {
        create: { bio: "I like to code" },
      },
    },
  });
  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    },
  });
  console.dir(allUsers, { depth: null });
}

//call the main function
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1); //close the database connections when the script terminates
  });
