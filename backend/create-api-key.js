// Script to create an API key for testing
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function createApiKey() {
  try {
    // Generate a random API key
    const apiKey = 'sk_' + crypto.randomBytes(32).toString('hex');

    // Create a default user first (if not exists)
    let user = await prisma.user.findFirst({
      where: { email: 'demo@storyly.io' }
    });

    if (!user) {
      console.log('Creating demo user...');
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('password123', 10);

      user = await prisma.user.create({
        data: {
          email: 'demo@storyly.io',
          name: 'Demo User',
          passwordHash: hashedPassword,
          role: 'ADMIN'
        }
      });
      console.log('✅ Demo user created!');
    }

    // Create API key
    const apiKeyRecord = await prisma.apiKey.create({
      data: {
        key: apiKey,
        appName: 'Storyly Android App',
        appId: 'com.example.storyly',
        platform: 'ANDROID',
        isActive: true,
        createdById: user.id
      }
    });

    console.log('\n🎉 API Key Created Successfully!\n');
    console.log('═══════════════════════════════════════════════');
    console.log('📱 App Name:', apiKeyRecord.appName);
    console.log('🔑 API Key:', apiKeyRecord.key);
    console.log('═══════════════════════════════════════════════');
    console.log('\n📋 Copy this API key and paste it in your Android app:\n');
    console.log(apiKeyRecord.key);
    console.log('\n');

  } catch (error) {
    console.error('Error creating API key:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createApiKey();
