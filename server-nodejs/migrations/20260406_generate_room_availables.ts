/**
 * Migration: Generate room_availables for April 2026
 * Run: npx tsx migrations/20260406_generate_room_availables.ts
 * Output: migrations/room_availables_april2026.json  (import via MongoDB Compass)
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Representative (mode) price per roomId, derived from existing hotel.room_availables.json
const ROOM_PRICES: Record<string, number> = {
  '678cee0841ae8aeb612c3498': 930000,
  '68fc868a2273c48c14f9844d': 1001000,
  '693ae2079c068b35da55af80': 2200000,
  '693ae5089c068b35da55b5bb': 6600000,
  '6963c58e22d721044e2f20d6': 1550000,
  '693ae4709c068b35da55b4af': 5500000,
  '693ae3ef9c068b35da55b3ab': 2920000,
  '693ae3819c068b35da55b2a8': 2300000,
  '693ae2d29c068b35da55b0ff': 2115000,
  '693ae17f9c068b35da55ae6b': 1880000,
};

const DEFAULT_INVENTORY = 5;
const YEAR = 2026;
const MONTH = 4; // April

function generateObjectId(): string {
  return crypto.randomBytes(12).toString('hex');
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function run() {
  const now = new Date();
  const totalDays = daysInMonth(YEAR, MONTH);
  const records: object[] = [];

  for (const [roomId, price] of Object.entries(ROOM_PRICES)) {
    for (let day = 1; day <= totalDays; day++) {
      // Use UTC midnight for each date
      const date = new Date(Date.UTC(YEAR, MONTH - 1, day));

      records.push({
        _id: { $oid: generateObjectId() },
        roomId: { $oid: roomId },
        date: { $date: date.toISOString() },
        price,
        inventory: DEFAULT_INVENTORY,
        createdAt: { $date: now.toISOString() },
        updatedAt: { $date: now.toISOString() },
        __v: 0,
      });
    }
  }

  const outputPath = path.join(__dirname, 'room_availables_april2026.json');
  fs.writeFileSync(outputPath, JSON.stringify(records, null, 2), 'utf-8');

  console.log(`✓ Generated ${records.length} records for April ${YEAR}`);
  console.log(`✓ Saved to: ${outputPath}`);
  console.log(`  Rooms   : ${Object.keys(ROOM_PRICES).length}`);
  console.log(`  Days    : ${totalDays}`);
  console.log(`  Inventory (default): ${DEFAULT_INVENTORY}`);
}

run();
