const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createApiKey() {
  try {
    console.log('Creating production API key...\n');

    // Create admin user
    const user = await prisma.user.upsert({
      where: { email: 'admin@storyly.io' },
      update: {},
      create: {
        email: 'admin@storyly.io',
        passwordHash: 'production_hash_' + Date.now(),
        name: 'Production Admin',
        role: 'ADMIN'
      }
    });

    console.log('✅ User created:', user.email);

    // Create production API key
    const apiKey = await prisma.apiKey.create({
      data: {
        key: 'sk_prod_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        appName: 'Storyly Production',
        appId: 'storyly_prod_app',
        platform: 'ANDROID',
        isActive: true,
        createdById: user.id
      }
    });

    console.log('\n✅ API Key created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📱 Your Production API Key:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n   ' + apiKey.key + '\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📝 Use this in your Android SDK:\n');
    console.log('   StorylyView(');
    console.log('       apiKey = "' + apiKey.key + '",');
    console.log('       backendUrl = "https://your-backend.railway.app"');
    console.log('   )\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('Error creating API key:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createApiKey();
