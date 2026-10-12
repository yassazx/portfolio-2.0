import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const markdown = await readFile(path.join(root, 'Ilyass_AZYAIZ_CV.md'), 'utf8');
const escape = (value) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const sections = new Map();
let current = 'intro';
for (const line of markdown.split(/\r?\n/)) {
  if (line.startsWith('## ')) current = line.slice(3).trim();
  else if (line.trim()) sections.set(current, [...(sections.get(current) || []), line.trim()]);
}
const intro = sections.get('intro');
const name = intro[0].replace(/^#\s+/, '');
const contacts = intro[1].split(' | ').filter((item) => !item.startsWith('LinkedIn:'));
const contactHTML = contacts.map((item) => {
  const label = escape(item);
  if (item.includes('@')) return `<a href="mailto:${label}">${label}</a>`;
  if (item.startsWith('+')) return `<a href="tel:${label}">${label}</a>`;
  return `<span>${label}</span>`;
}).join('<span class="separator" aria-hidden="true">/</span>');

const experience = sections.get('Experience').map((line) => {
  const match = line.match(/^- (.*?), (.*?) \(([^)]+)\): (.*)$/);
  if (!match) throw new Error(`Unsupported experience format: ${line}`);
  const [, company, role, dates, description] = match;
  return `<article class="position"><div class="position-heading"><h3>${escape(company)}</h3><time>${escape(dates)}</time></div><p class="role">${escape(role)}</p><ul>${description.split('; ').map((item) => `<li>${escape(item)}</li>`).join('')}</ul></article>`;
}).join('');

const education = sections.get('Education').map((line) => {
  const value = line.replace(/^- /, '');
  const firstComma = value.indexOf(', ');
  const school = value.slice(0, firstComma);
  const remainder = value.slice(firstComma + 2);
  return `<li><strong>${escape(school)}</strong><span>${escape(remainder)}</span></li>`;
}).join('');

const skills = sections.get('Skills').map((line) => {
  const value = line.replace(/^- /, '');
  const separator = value.indexOf(': ');
  return `<div class="skill-row"><dt>${escape(value.slice(0, separator))}</dt><dd>${escape(value.slice(separator + 2))}</dd></div>`;
}).join('');

const certifications = sections.get('Certifications').join(' ').split('; ').map((item) => `<li>${escape(item)}</li>`).join('');
const languages = escape(sections.get('Languages').join(' '));

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${escape(name)} — Software Engineer</title>
<style>
  @page { size: A4; margin: 15mm 17mm 14mm; }
  * { box-sizing: border-box; }
  html { font-size: 9.25pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin: 0; color: #19261f; background: #fff; font-family: Arial, Helvetica, sans-serif; line-height: 1.43; }
  main { width: 100%; }
  header { border-bottom: 2px solid #243f32; padding-bottom: 5mm; margin-bottom: 5.3mm; }
  h1 { font-size: 29pt; letter-spacing: -1.35px; line-height: 1; margin: 0 0 2.5mm; font-weight: 700; }
  .title { margin: 0 0 3mm; font-size: 12pt; color: #42604e; letter-spacing: .05em; }
  .contacts { display: flex; gap: 2.5mm; align-items: center; font-size: 8.65pt; color: #4e5b53; }
  a { color: inherit; text-decoration: none; }
  .separator { color: #84978b; }
  section { margin-top: 4.5mm; }
  h2 { font-size: 8.1pt; letter-spacing: .16em; text-transform: uppercase; color: #42604e; margin: 0 0 2.8mm; display: flex; align-items: center; gap: 3mm; }
  h2::after { content: ''; height: 1px; background: #dce4dd; flex: 1; }
  .position { margin-bottom: 3.3mm; break-inside: avoid; }
  .position:last-child { margin-bottom: 0; }
  .position-heading { display: flex; justify-content: space-between; gap: 5mm; align-items: baseline; }
  h3 { margin: 0; font-size: 10.15pt; line-height: 1.3; }
  time { color: #5c6860; font-size: 8.5pt; white-space: nowrap; }
  .role { margin: .5mm 0 1.2mm; font-weight: 600; font-size: 9.15pt; }
  ul { margin: 0; padding-left: 3.7mm; }
  li { padding-left: .6mm; margin-bottom: .65mm; }
  li::marker { color: #607d69; }
  .education { list-style: none; padding: 0; }
  .education li { padding: 0; margin-bottom: 2mm; }
  .education strong { display: block; font-size: 9.25pt; }
  .education span { display: block; margin-top: .25mm; color: #4e5b53; font-size: 8.9pt; }
  dl { margin: 0; }
  .skill-row { display: grid; grid-template-columns: 27mm 1fr; gap: 3mm; margin-bottom: 1.2mm; }
  dt { font-size: 8.8pt; font-weight: 700; }
  dd { margin: 0; font-size: 8.9pt; color: #36463b; }
  .bottom { display: grid; grid-template-columns: 1.9fr 1fr; gap: 7mm; }
  .bottom section { break-inside: avoid; }
  .certifications { padding-left: 3.7mm; font-size: 8.7pt; }
  .languages { margin: 0; font-size: 8.7pt; line-height: 1.65; }
  @media screen { body { width: 210mm; padding: 15mm 17mm 14mm; margin: auto; } }
</style></head><body><main>
<header><h1>${escape(name)}</h1><p class="title">Software Engineer</p><div class="contacts">${contactHTML}</div></header>
<section><h2>Experience</h2>${experience}</section>
<section><h2>Education</h2><ul class="education">${education}</ul></section>
<section><h2>Skills</h2><dl>${skills}</dl></section>
<div class="bottom"><section><h2>Certifications</h2><ul class="certifications">${certifications}</ul></section><section><h2>Languages</h2><p class="languages">${languages}</p></section></div>
</main></body></html>`;

await mkdir(path.join(root, 'research'), { recursive: true });
await mkdir(path.join(root, 'public'), { recursive: true });
await writeFile(path.join(root, 'research/cv.html'), html, 'utf8');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  await page.setContent(html, { waitUntil: 'load' });
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => document.fonts.ready);
  const output = path.join(root, 'public/Ilyass-Azyaiz-CV.pdf');
  const pdf = await page.pdf({ path: output, format: 'A4', printBackground: true, preferCSSPageSize: true, tagged: true });
  const pages = [...pdf.toString('latin1').matchAll(/\/Type\s*\/Page\b/g)].length;
  if (pages !== 1) throw new Error(`CV must fit one A4 page; generated ${pages} pages.`);
  const content = await page.locator('main').innerText();
  const requiredFacts = ['~20K records/day', '12 KPIs', '4h to 30min', '2021-2026', 'May 2023-Aug 2024', 'Lycée Othmane Bnu Affane', 'Jun-Aug 2026'];
  for (const fact of requiredFacts) if (!content.includes(fact)) throw new Error(`Missing source fact: ${fact}`);
  console.log(JSON.stringify({ output, pages, bytes: pdf.length, title: `${name} — Software Engineer`, preservedFacts: requiredFacts.length }));
} finally {
  await browser.close();
}
