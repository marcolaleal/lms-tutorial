const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Tecnologia da Informação" },
        { name: "Musica" },
        { name: "Saúde" },
        { name: "Fotografia" },
        { name: "Engenharia" },
        { name: "Cinema" },
        { name: "Gestão" }, 
      ]
    });

    console.log("Success seed database categories")
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();