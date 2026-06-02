import fs from 'node:fs';
const html = fs.readFileSync('landing3(1).html', 'utf8');
const lines = html.split('\n');
function dataUriFromLine(idx) {
  const line = lines[idx - 1];
  const m = line.match(/src="(data:[^"]+)"/);
  if (!m) throw new Error('no data uri on line ' + idx);
  return m[1];
}
function save(dataUri, outPath) {
  const m = dataUri.match(/^data:([^;]+);base64,(.*)$/s);
  if (!m) throw new Error('bad data uri');
  const buf = Buffer.from(m[2], 'base64');
  fs.writeFileSync(outPath, buf);
  console.log(outPath, buf.length, 'bytes', m[1]);
}
save(dataUriFromLine(706), 'public/media/before.jpg');
save(dataUriFromLine(707), 'public/media/after.jpg');
save(dataUriFromLine(739), 'public/media/memory.mp4');
