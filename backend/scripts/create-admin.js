#!/usr/bin/env node
/**
 * Creates (or updates) the single dashboard admin, then demotes everyone else
 * so exactly one account can sign in. Run it on the server; the password is
 * typed here and only ever stored as a bcrypt hash.
 *
 *   node scripts/create-admin.js
 */
const readline = require('readline');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function ask(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      const onData = (char) => {
        if (['\n', '\r', '\u0004'].includes(char.toString())) {
          process.stdin.removeListener('data', onData);
        } else {
          readline.moveCursor(process.stdout, -100, 0);
          readline.clearLine(process.stdout, 1);
          process.stdout.write(question + '*'.repeat(rl.line.length));
        }
      };
      process.stdin.on('data', onData);
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write('\n');
      resolve(answer.trim());
    });
  });
}

(async () => {
  const email = (await ask('Admin email: ')).toLowerCase();
  if (!email.includes('@')) throw new Error('That is not an email address');

  const name = (await ask('Display name: ')) || email.split('@')[0];

  const password = await ask('Password (min 8 chars): ', { hidden: true });
  if (password.length < 8) throw new Error('Password must be at least 8 characters');

  const again = await ask('Confirm password: ', { hidden: true });
  if (password !== again) throw new Error('Passwords do not match');

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: 'ADMIN', name },
    create: { email, passwordHash, role: 'ADMIN', name },
  });

  // Anyone else keeps their content ownership but loses the ability to sign in,
  // because login requires the ADMIN role.
  const demoted = await prisma.user.updateMany({
    where: { id: { not: admin.id }, role: 'ADMIN' },
    data: { role: 'VIEWER' },
  });

  console.log(`\n✅ Admin ready: ${admin.email}`);
  if (demoted.count > 0) {
    console.log(`   ${demoted.count} other admin account(s) demoted — they can no longer sign in.`);
  }
  const others = await prisma.user.findMany({ where: { role: 'ADMIN' }, select: { email: true } });
  console.log(`   Accounts able to sign in: ${others.map((u) => u.email).join(', ')}`);
})()
  .catch((e) => { console.error('\n❌ ' + e.message); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
