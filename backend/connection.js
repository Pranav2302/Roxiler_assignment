import prisma from "./config/db.js";

async function testConnection() {
    try {
        console.log('Testing database connection...');

        // basic connect
        await prisma.$connect();
        console.log('Database connection successful!');
        
        // Test
        const userCount = await prisma.user.count();
        console.log(`Current users in database: ${userCount}`);
        
        const storeCount = await prisma.store.count();
        console.log(` Current stores in database: ${storeCount}`);
        
        const ratingCount = await prisma.rating.count();
        console.log(`Current ratings in database: ${ratingCount}`);
        
        console.log(' All database tables are accessible!');

    } catch (error) {
        console.error(' Database connection failed:');
        console.error('Error:', error.message);
        console.error('Code:', error.code);
        
        if (error.code === 'P1001') {
            console.log(' Make sure PostgreSQL is running and DATABASE_URL is correct');
        }
        if (error.code === 'P1003') {
            console.log(' Database does not exist. Run: npx prisma migrate dev');
        }
    } finally {
        await prisma.$disconnect();
        console.log('Database connection closed');
    }
}

testConnection();