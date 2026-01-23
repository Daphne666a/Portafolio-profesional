// Script para optimizar imágenes - Ejecutar con: node optimize-images.js
// Primero instala sharp: npm install sharp

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesToOptimize = [
  'Portafolio.png',
  'veterinaria.png',
  'tienda virtual.png'
];

async function optimizeImages() {
  console.log('Iniciando optimización de imágenes...\n');

  for (const image of imagesToOptimize) {
    if (!fs.existsSync(image)) {
      console.log(`⚠️  ${image} no encontrado, saltando...`);
      continue;
    }

    const inputPath = image;
    const outputPath = image.replace('.png', '.webp');

    try {
      await sharp(inputPath)
        .webp({ quality: 85 })
        .resize(600, 400, {
          fit: 'cover',
          position: 'center'
        })
        .toFile(outputPath);

      const originalSize = fs.statSync(inputPath).size;
      const optimizedSize = fs.statSync(outputPath).size;
      const saved = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

      console.log(`✅ ${image} → ${outputPath}`);
      console.log(`   Original: ${(originalSize / 1024).toFixed(1)} KB`);
      console.log(`   Optimizada: ${(optimizedSize / 1024).toFixed(1)} KB`);
      console.log(`   Ahorro: ${saved}%\n`);
    } catch (error) {
      console.error(`❌ Error optimizando ${image}:`, error.message);
    }
  }

  console.log('✨ Optimización completada!');
  console.log('\nPróximos pasos:');
  console.log('1. Actualiza las referencias en index.html (.png → .webp)');
  console.log('2. Verifica que las imágenes se vean correctamente');
  console.log('3. Puedes eliminar los archivos .png originales si lo deseas');
}

optimizeImages().catch(console.error);
