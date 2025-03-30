const fs = require('fs');
const path = require('path');

const from = path.join(__dirname, 'public', '_redirects');
const to = path.join(__dirname, 'dist', 'frontend-app', '_redirects');

fs.copyFile(from, to, (err) => {
  if (err) {
    console.error('❌ Error copiando _redirects:', err);
  } else {
    console.log('✅ Archivo _redirects copiado exitosamente al build.');
  }
});
