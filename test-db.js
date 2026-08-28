require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const count = await prisma.university.count();
  console.log('Universities:', count);
  const unis = await prisma.university.findMany({ take: 5, include: { country: true } });
  console.log('Sample:', JSON.stringify(unis, null, 2));
  await prisma.$disconnect();
}

test().catch(e => console.error(e));