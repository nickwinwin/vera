import { readFileSync } from 'fs';
import { join } from 'path';

export default function StatusPage() {
  const html = readFileSync(join(process.cwd(), 'status', 'index.html'), 'utf-8');
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
