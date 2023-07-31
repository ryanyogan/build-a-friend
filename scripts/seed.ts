const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
  try {
    await db.category.createMany({
      data: [
        { name: "Famous People" },
        { name: "Moves & TV" },
        { name: "Musicians" },
        { name: "Games" },
        { name: "Animals" },
        { name: "Athletes" },
        { name: "Scientists" },
        { name: "Ass Holes" },
      ],
    });
  } catch (error) {
    console.error("Error seeding categories...");
    console.error(error);
  } finally {
    await db.$disconnect();
  }
}

main();
