import { readFileSync } from 'fs';
import { join } from 'path';

export default function ReactivationPage() {
  const html = readFileSync(join(process.cwd(), 'status', 'reactivation.html'), 'utf-8');
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
