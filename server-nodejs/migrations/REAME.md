# Migrations

This folder contains manual migration scripts for updating MongoDB collections and documents.

## How to Use

1. **Write migration scripts**  
   - Each migration script should be a TypeScript file named with the format:  
     `YYYYMMDD_description.ts`  
   - Example: `20250629_rename_room_fields.ts`

2. **Run a migration script**  
   - Make sure your `.env` file contains the correct `MONGODB_URI`.
   - Use the following command to run a migration:
     ```
     npx tsx migrations/20250629_rename_room_fields.ts
     ```

3. **Migration script structure**  
   - Each script should connect to MongoDB, perform the migration, and then disconnect.
   - Example tasks: renaming fields, updating data, adding indexes, etc.

4. **Best Practices**
   - Write a new migration script for each schema or data change.
   - Do not modify or delete old migration scripts.
   - Keep migration scripts idempotent if possible.
