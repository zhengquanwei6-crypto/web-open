import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Colors
  content = content.replace(/text-gray-/g, 'text-slate-');
  content = content.replace(/text-blue-400/g, 'text-indigo-400');
  content = content.replace(/text-blue-500/g, 'text-indigo-500');
  content = content.replace(/text-blue-300/g, 'text-indigo-300');
  content = content.replace(/bg-blue-600/g, 'bg-indigo-600');
  content = content.replace(/bg-blue-500/g, 'bg-indigo-500');
  content = content.replace(/bg-blue-900/g, 'bg-indigo-900');
  content = content.replace(/from-blue-500/g, 'from-indigo-500');
  content = content.replace(/from-blue-600/g, 'from-indigo-600');
  content = content.replace(/border-blue-500/g, 'border-indigo-500');
  content = content.replace(/ring-blue-500/g, 'ring-indigo-500');
  content = content.replace(/accent-blue-500/g, 'accent-indigo-500');

  // Backgrounds
  content = content.replace(/bg-\[#0D0D15\]/g, 'bg-white/5 border border-white/10 backdrop-blur-xl');
  content = content.replace(/bg-\[#0A0A10\]/g, 'bg-[#0a0b1e]');
  content = content.replace(/bg-black\/40/g, 'bg-black/20');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
