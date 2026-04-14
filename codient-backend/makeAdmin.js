const prisma = require('./src/db');

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error('Please provide an email address. Usage: node makeAdmin.js <email>');
    process.exit(1);
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });

    console.log(`Success! User ${user.email} is now an ADMIN.`);
  } catch (error) {
    console.error(`Failed to elevate user: ${error.message}`);
    if (error.code === 'P2025') {
      console.error('User not found in the database.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
