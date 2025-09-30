import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

console.log('🔥 Migration script started...');

// ES modules compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📂 Current directory:', __dirname);

dotenv.config();
console.log('⚙️ Environment loaded');

const MONGODB_URI = process.env.MONGODB_URI as string;
console.log('🔗 MongoDB URI:', MONGODB_URI ? 'Found' : 'Not found');

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment variables');
    process.exit(1);
}

interface MigrationResult {
    filename: string;
    status: 'success' | 'error' | 'skipped';
    message?: string;
    error?: string;
    modifiedCount?: number;
}

async function runAllMigrations() {
    const results: MigrationResult[] = [];
    
    try {
        console.log('🚀 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB for migrations\n');

        console.log('📁 Reading migration files from:', __dirname);
        const allFiles = fs.readdirSync(__dirname);
        console.log('📄 All files in directory:', allFiles);

        const migrationFiles = allFiles
            .filter(file => {
                const isTs = file.endsWith('.ts');
                const isNotSelf = file !== 'run-all-migrations.ts';
                const isNotReadme = !file.includes('README');
                console.log(`   ${file}: ts=${isTs}, notSelf=${isNotSelf}, notReadme=${isNotReadme}`);
                return isTs && isNotSelf && isNotReadme;
            })
            .sort(); 

        console.log(`\n📦 Found ${migrationFiles.length} migration files:`);
        migrationFiles.forEach(file => console.log(`   • ${file}`));
        console.log('');

        if (migrationFiles.length === 0) {
            console.log('⚠️ No migration files found to run');
            return;
        }

        for (let i = 0; i < migrationFiles.length; i++) {
            const file = migrationFiles[i];
            console.log(`🔄 [${i + 1}/${migrationFiles.length}] Running ${file}...`);
            
            try {
                const migrationPath = path.join(__dirname, file);
                console.log(`   📍 Full path: ${migrationPath}`);
                
                const projectRoot = path.dirname(__dirname);
                console.log(`   🏠 Project root: ${projectRoot}`);
                
                const command = `npx tsx "${migrationPath}"`;
                console.log(`   ⚡ Command: ${command}`);
                
                const output = execSync(command, { 
                    encoding: 'utf-8',
                    stdio: 'pipe',
                    cwd: projectRoot,
                    timeout: 30000
                });
                
                console.log('   📤 Output:');
                console.log(output);
                
                results.push({
                    filename: file,
                    status: 'success',
                    message: 'Migration completed successfully'
                });
                
            } catch (error: any) {
                console.error(`❌ Error running ${file}:`);
                console.error('   Error message:', error.message);
                console.error('   Error stdout:', error.stdout?.toString());
                console.error('   Error stderr:', error.stderr?.toString());
                
                results.push({
                    filename: file,
                    status: 'error',
                    error: error.message
                });
            }
            
            console.log(''); 
        }

        console.log('\n🎯 === MIGRATION SUMMARY ===');
        results.forEach(result => {
            const statusIcon = result.status === 'success' ? '✅' : 
                              result.status === 'error' ? '❌' : '⏭️';
            const message = result.error || result.message || '';
            console.log(`${statusIcon} ${result.filename}: ${result.status.toUpperCase()} - ${message}`);
        });

        const successCount = results.filter(r => r.status === 'success').length;
        const errorCount = results.filter(r => r.status === 'error').length;
        const skippedCount = results.filter(r => r.status === 'skipped').length;

        console.log(`\n📊 Total: ${results.length} files`);
        console.log(`✅ Success: ${successCount}`);
        console.log(`❌ Errors: ${errorCount}`);
        console.log(`⏭️ Skipped: ${skippedCount}`);

        if (errorCount > 0) {
            console.log('\n⚠️  Some migrations failed. Please check the errors above.');
            process.exit(1);
        } else {
            console.log('\n🎉 All migrations completed successfully!');
        }

    } catch (error: any) {
        console.error('💥 Failed to run migrations:');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        process.exit(1);
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('🔌 Database connection closed');
        }
    }
}

console.log('🎬 About to run migrations...');

console.log('🔍 import.meta.url:', import.meta.url);
console.log('🔍 process.argv[1]:', process.argv[1]);
console.log('🔍 Should run?', import.meta.url === `file://${process.argv[1]}`);

runAllMigrations().catch(error => {
    console.error('💥 Unhandled error in runAllMigrations:');
    console.error(error);
    process.exit(1);
});

export default runAllMigrations;