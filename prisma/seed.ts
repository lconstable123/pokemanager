import { Prisma, PrismaClient } from "@/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const seedPkData = [
  {
    name: "Johnny",
    species: "Pikachu",
    ball: "01",
    exp: 23,
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    types: '["Electric"]',
  },
];
const seedTrainerData = [
  {
    name: "Ash",
    email: "ash.ketchum@example.com",
    avatar: 1,
  },
];
async function main() {
  console.log(`Start seeding ...`);

  //seed trainers
  for (const trainer of seedTrainerData) {
    const hash = await bcrypt.hash("password", 10);
    const createdTrainer = await prisma.trainer.create({
      data: {
        ...trainer,
        hashedPassword: hash,
      },
    });
    // seed pks
    for (const pk of seedPkData) {
      const result = await prisma.pokemon.create({
        data: { ...pk, userId: createdTrainer.id },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

//seed pks
