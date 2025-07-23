import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
      const { players } = await import(`./seed/players`);
      for (const data of players) {
    await prisma.player.create({ data });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
