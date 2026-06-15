import fs from 'fs';
import path from 'path';

const htmlPath = path.resolve('c:/Users/josue/.gemini/antigravity/scratch/tchapo-app/backend/tchapo-tchapo/index.html');
const content = fs.readFileSync(htmlPath, 'utf8');
const lines = content.split('\n');

lines.forEach((line, index) => {
    if (line.includes('btn-meus-pedidos') || line.includes('nav-right') || line.includes('modal') || line.includes('cart-footer')) {
        console.log(`L${index + 1}: ${line.trim()}`);
    }
});
