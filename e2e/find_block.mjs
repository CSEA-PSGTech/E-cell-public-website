import fs from 'fs';
import * as babelParser from '@babel/parser';

const code = fs.readFileSync('src/components/team/TeamSection.tsx', 'utf8');
const lines = code.split('\n');

for (let k = 80; k < 465; k++) {
  const testCode = lines.slice(0, k).join('\n') + '\nreturn null;\n}\nexport default TeamSection;';
  try {
    babelParser.parse(testCode, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
  } catch (e) {
    console.log(`Failed at line ${k}: ${e.message}`);
    console.log(`Line was: ${lines[k-1]}`);
    break;
  }
}
