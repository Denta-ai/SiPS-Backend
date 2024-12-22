import { PrismaClient } from '@prisma/client';

export const generateUniqueTransactionCode = async (prisma: PrismaClient) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code;
  let existingTransaction;

  do {
    code = '';
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      code += chars[randomIndex];
    }

    existingTransaction = await prisma.transaction.findUnique({
      where: { transactionCode: code },
    });
  } while (existingTransaction);

  return `TX-${code}`;
};
