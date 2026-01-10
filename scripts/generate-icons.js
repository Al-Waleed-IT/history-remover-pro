/**
 * Icon Generation Script
 *
 * This script generates PNG icons from the SVG source.
 * Requires: npm install sharp
 *
 * Run: node scripts/generate-icons.js
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const sizes = [16, 32, 48, 128];

async function generateIcons() {
  try {
    // Try to use sharp if available
    const sharp = await import('sharp').catch(() => null);

    if (sharp) {
      const svgPath = join(rootDir, 'icons', 'icon.svg');
      const svgBuffer = readFileSync(svgPath);

      for (const size of sizes) {
        const outputPath = join(rootDir, 'icons', `icon${size}.png`);
        await sharp.default(svgBuffer)
          .resize(size, size)
          .png()
          .toFile(outputPath);
        console.log(`Generated: icon${size}.png`);
      }

      console.log('All icons generated successfully!');
    } else {
      console.log('Sharp not available. Creating placeholder icons...');
      createPlaceholderIcons();
    }
  } catch (error) {
    console.error('Error generating icons:', error.message);
    console.log('Creating placeholder icons as fallback...');
    createPlaceholderIcons();
  }
}

function createPlaceholderIcons() {
  // Simple 1x1 blue pixel PNG as minimal placeholder
  // In production, replace these with proper icons
  const minimalPng = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 dimensions
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
    0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
    0x54, 0x08, 0xD7, 0x63, 0x38, 0x68, 0xD0, 0x00,
    0x00, 0x00, 0x83, 0x00, 0x81, 0x63, 0x15, 0x94,
    0x34, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E,
    0x44, 0xAE, 0x42, 0x60, 0x82
  ]);

  for (const size of sizes) {
    const outputPath = join(rootDir, 'icons', `icon${size}.png`);
    writeFileSync(outputPath, minimalPng);
    console.log(`Created placeholder: icon${size}.png`);
  }

  console.log('\nNote: Replace placeholder icons with proper PNG files before publishing.');
  console.log('You can use tools like Inkscape, GIMP, or online converters to generate PNGs from icon.svg');
}

generateIcons();
