import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const mapping = JSON.parse(readFileSync('/home/ubuntu/image_mapping.json', 'utf-8'));

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Update property images
  console.log('=== UPDATING PROPERTY IMAGES ===');
  let propCount = 0;
  for (const [pid, url] of Object.entries(mapping.properties)) {
    // Set images as JSON array with the URL
    const images = JSON.stringify([url]);
    await conn.execute('UPDATE properties SET images = ? WHERE id = ?', [images, parseInt(pid)]);
    propCount++;
    console.log(`  Property ${pid}: updated`);
  }
  console.log(`Properties updated: ${propCount}`);
  
  // Update neighborhood hero images
  console.log('\n=== UPDATING NEIGHBORHOOD HERO IMAGES ===');
  let hoodCount = 0;
  for (const [nid, url] of Object.entries(mapping.neighborhoods)) {
    await conn.execute('UPDATE neighborhoods SET heroImage = ? WHERE id = ?', [url, parseInt(nid)]);
    hoodCount++;
  }
  console.log(`Neighborhoods updated: ${hoodCount}`);
  
  // Also update city hero images using the first neighborhood image from each city
  console.log('\n=== UPDATING CITY HERO IMAGES ===');
  // Riyadh (cityId=1) - use Al Olaya (id=1)
  if (mapping.neighborhoods['1']) {
    await conn.execute('UPDATE cities SET heroImage = ? WHERE id = 1', [mapping.neighborhoods['1']]);
    console.log('  Riyadh: updated with Al Olaya image');
  }
  // Jeddah (cityId=2) - use Al Hamra Jeddah (id=26)
  if (mapping.neighborhoods['26']) {
    await conn.execute('UPDATE cities SET heroImage = ? WHERE id = 2', [mapping.neighborhoods['26']]);
    console.log('  Jeddah: updated with Al Hamra image');
  }
  // Madinah (cityId=3) - use Al Haram District (id=47)
  if (mapping.neighborhoods['47']) {
    await conn.execute('UPDATE cities SET heroImage = ? WHERE id = 3', [mapping.neighborhoods['47']]);
    console.log('  Madinah: updated with Al Haram District image');
  }
  
  // Verify
  const [props] = await conn.query('SELECT id, titleEn, images FROM properties ORDER BY id');
  console.log('\n=== VERIFICATION ===');
  for (const p of props) {
    const imgs = JSON.parse(p.images || '[]');
    console.log(`  Property ${p.id} (${p.titleEn}): ${imgs.length} image(s)`);
  }
  
  const [hoods] = await conn.query('SELECT COUNT(*) as cnt FROM neighborhoods WHERE heroImage IS NOT NULL AND heroImage != ""');
  console.log(`  Neighborhoods with hero images: ${hoods[0].cnt}`);
  
  const [cities] = await conn.query('SELECT id, nameEn, heroImage FROM cities ORDER BY id');
  for (const c of cities) {
    console.log(`  City ${c.nameEn}: ${c.heroImage ? 'has image' : 'no image'}`);
  }
  
  await conn.end();
  console.log('\nDone!');
}

main().catch(console.error);
