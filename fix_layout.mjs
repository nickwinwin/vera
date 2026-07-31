import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('app/layout.tsx', 'utf8');
c = c.replace("import { Inter_Tight, Instrument_Serif } from 'next/font/google';", "import { Inter, Playfair_Display } from 'next/font/google';");
c = c.replace('const inter = Inter_Tight({', 'const inter = Inter({');
c = c.replace(`const instrument = Instrument_Serif({\n  subsets: ['latin'],\n  weight: ['400'],\n  style: ['normal', 'italic'],\n  variable: '--font-display',\n});`, `const playfair = Playfair_Display({\n  subsets: ['latin'],\n  variable: '--font-display',\n});`);
c = c.replace('${inter.variable} ${instrument.variable}', '${inter.variable} ${playfair.variable}');
writeFileSync('app/layout.tsx', c, 'utf8');
console.log('Layout fixed');