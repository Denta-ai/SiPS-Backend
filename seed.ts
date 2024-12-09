import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.createMany({
    data: [
      {
        username: 'user1',
        email: 'user1@example.com',
        password: 'password1',
        phone_number: 123456789,
      },
      {
        username: 'user2',
        email: 'user2@example.com',
        password: 'password2',
        phone_number: 234567890,
      },
      {
        username: 'user3',
        email: 'user3@example.com',
        password: 'password3',
        phone_number: 345678901,
      },
      {
        username: 'user4',
        email: 'user4@example.com',
        password: 'password4',
        phone_number: 456789012,
      },
      {
        username: 'user5',
        email: 'user5@example.com',
        password: 'password5',
        phone_number: 567890123,
      },
    ],
  });

  const usersData = await prisma.user.findMany();

  const schedules = await prisma.schedule.createMany({
    data: [
      { date: new Date('2024-12-05T10:00:00Z'), hour: '10:00', price: 100.0 },
      { date: new Date('2024-12-05T11:00:00Z'), hour: '11:00', price: 100.0 },
      { date: new Date('2024-12-05T12:00:00Z'), hour: '12:00', price: 100.0 },
      { date: new Date('2024-12-06T10:00:00Z'), hour: '10:00', price: 120.0 },
      { date: new Date('2024-12-06T11:00:00Z'), hour: '11:00', price: 120.0 },
    ],
  });

  const schedulesData = await prisma.schedule.findMany();

  const transactions = await prisma.transaction.createMany({
    data: [
      {
        userId: usersData[0].id,
        bandName: 'Band 1',
        duration: 1,
        paymentProof: 'proof1',
        totalPrice: 100.0,
        notes: 'Some notes',
        status: 'pending',
      },
      {
        userId: usersData[1].id,
        bandName: 'Band 2',
        duration: 2,
        paymentProof: 'proof2',
        totalPrice: 200.0,
        notes: 'Some notes',
        status: 'approved',
      },
      {
        userId: usersData[2].id,
        bandName: 'Band 3',
        duration: 1,
        paymentProof: 'proof3',
        totalPrice: 120.0,
        notes: 'Some notes',
        status: 'pending',
      },
      {
        userId: usersData[3].id,
        bandName: 'Band 4',
        duration: 2,
        paymentProof: 'proof4',
        totalPrice: 240.0,
        notes: 'Some notes',
        status: 'approved',
      },
      {
        userId: usersData[4].id,
        bandName: 'Band 5',
        duration: 1,
        paymentProof: 'proof5',
        totalPrice: 100.0,
        notes: 'Some notes',
        status: 'pending',
      },
    ],
  });

  const transactionsData = await prisma.transaction.findMany();

  await prisma.transactionSchedule.createMany({
    data: [
      { transactionId: transactionsData[0].id, scheduleId: schedulesData[0].id },
      { transactionId: transactionsData[0].id, scheduleId: schedulesData[1].id },
      { transactionId: transactionsData[1].id, scheduleId: schedulesData[2].id },
      { transactionId: transactionsData[2].id, scheduleId: schedulesData[3].id },
      { transactionId: transactionsData[2].id, scheduleId: schedulesData[4].id },
    ],
  });

  console.log('Seed data has been inserted successfully!');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
