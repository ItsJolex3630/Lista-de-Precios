import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const RESULTS_FILE = '/home/z/my-project/download/reposicion_results.json';
const PAGES_DIR = '/home/z/my-project/download/pdf_pages';

// Load existing results if any
let results = {};
if (fs.existsSync(RESULTS_FILE)) {
  results = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));
}

async function main() {
  const zai = await ZAI.create();
  
  // Get all page files (skip page 1 which is just title)
  const files = fs.readdirSync(PAGES_DIR)
    .filter(f => f.endsWith('.png'))
    .sort();
  
  let processed = 0;
  const MAX_PAGES = 68; // Process all pages
  
  for (const file of files) {
    const pageNum = parseInt(file.match(/page_(\d+)/)[1]);
    if (pageNum < 2) continue; // Skip title page
    if (results[pageNum]) continue; // Already processed
    
    if (processed >= MAX_PAGES) break;
    
    const filePath = path.join(PAGES_DIR, file);
    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString('base64');
    
    try {
      const response = await zai.chat.completions.createVision({
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Lista SOLO los nombres completos de perfumes que tengan "A LA ESPERA DE REPOSICION". Un nombre por línea. Si no hay ninguno, escribe NINGUNO. No expliques nada, solo los nombres.'
            },
            {
              type: 'image_url',
              image_url: { url: `data:image/png;base64,${base64Image}` }
            }
          ]
        }],
        thinking: { type: 'disabled' }
      });
      
      const content = response.choices[0]?.message?.content || 'NINGUNO';
      results[pageNum] = content.trim();
      
      // Save after each page
      fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
      
      processed++;
      console.log(`Page ${pageNum}: ${content.trim().substring(0, 100)}`);
    } catch (err) {
      console.log(`Page ${pageNum}: ERROR - ${err.message}`);
    }
  }
  
  console.log(`\nProcessed ${processed} new pages. Total: ${Object.keys(results).length} pages.`);
}

main().catch(console.error);
