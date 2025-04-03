import { prismaClient } from "../src";

const RANDOM_NUMBER = Math.random() * 10;

async function seed() {
  const user = await prismaClient.user.create({
    data: {
      email: `test${RANDOM_NUMBER}@test.com`,
      // password: "password",
    },
  });

  const website = await prismaClient.website.create({
    data: {
      url: `https://test${RANDOM_NUMBER}.com`,
      userId: user.id,
    },
  });

  const validator = await prismaClient.validator.create({
    data: {
      publicKey: "publicKey",
      localtion: "localtion",
      ip: "ip",
    },
  });

  await prismaClient.websiteTicks.create({
    data: {
      websiteId: website.id,
      validatorId: validator.id,
      createAt: new Date(),
      status: "UP",
      latency: 100,
    },
  });

  await prismaClient.websiteTicks.create({
    data: {
      websiteId: website.id,
      validatorId: validator.id,
      createAt: new Date(),
      status: "DOWN",
      latency: 100,
    },
  });

  await prismaClient.websiteTicks.create({
    data: {
      websiteId: website.id,
      validatorId: validator.id,
      createAt: new Date(),
      status: "UP",
      latency: 100,
    },
  });
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
