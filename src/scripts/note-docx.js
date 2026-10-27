/*
 * 엔딩노트를 Word(.docx) 파일로 만듭니다.
 *
 * 전부 사용자의 브라우저 안에서 만들어집니다. 서버로 보내는 것은 없습니다.
 * docx 라이브러리가 커서, 사용자가 "Word 파일로 내려받기"를 누를 때만
 * 불러오도록(note.astro 에서 import()) 나누어 두었습니다.
 */
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, Footer, PageNumber,
} from 'docx';
import JSZip from 'jszip';

/*
 * 이어 쓰기 정보: 내려받는 Word 파일 안에 "dajeongri/note.json" 을 함께 넣어 둡니다.
 * 다른 기기에서 "내 파일 불러오기"로 그 파일을 고르면 이 정보를 읽어 쓰던 내용을 되살립니다.
 * Word 화면에는 보이지 않고, 파일을 Word에서 고쳐 다시 저장하면 이 정보는 빠질 수 있습니다.
 */
const DATA_PATH = 'dajeongri/note.json';
const APP = 'dajeongri-note';

const FONT = '맑은 고딕';
const GREEN = '2F4B47';
const LINE = 'D9D2C5';
const W = 9026; // A4, 좌우 여백 1인치일 때 본문 폭(1/20pt 단위)

const run = (text, o = {}) => new TextRun({ text, font: FONT, size: 22, ...o });
const para = (children, o = {}) => new Paragraph({ spacing: { after: 120, line: 320 }, ...o, children });

// 여러 줄 글은 줄마다 문단을 나눕니다(Word 는 \n 을 줄바꿈으로 보지 않습니다).
const lines = (text) => String(text).split(/\r?\n/);

function heading(text, n) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    keepNext: true,
    spacing: { before: 360, after: 140 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: LINE, space: 4 } },
    children: [run(`${n}. ${text}`, { size: 28, bold: true, color: GREEN })],
  });
}

function cell(text, { head = false, width }) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: head ? { type: ShadingType.CLEAR, fill: 'F2ECE2', color: 'auto' } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: lines(text || '').map((l) => new Paragraph({
      spacing: { after: 40, line: 300 },
      children: [run(l, { size: 20, bold: head, color: head ? GREEN : '222222' })],
    })),
  });
}

function listTable(cols, rows) {
  // 여러 줄 글(textarea) 칸은 넓게, 나머지는 고르게 나눕니다.
  const weights = cols.map((c) => (c.kind === 'textarea' ? 2 : 1));
  const sum = weights.reduce((a, b) => a + b, 0);
  const widths = weights.map((w) => Math.floor((W * w) / sum));
  widths[widths.length - 1] += W - widths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({ tableHeader: true, children: cols.map((c, i) => cell(c.label, { head: true, width: widths[i] })) }),
      ...rows.map((r) => new TableRow({ children: cols.map((c, i) => cell(r[c.id], { width: widths[i] })) })),
    ],
  });
}

export async function buildDocx(sections, data) {
  const me = data.me || {};
  const body = [];

  body.push(
    new Paragraph({ alignment: AlignmentType.LEFT, spacing: { before: 600, after: 120 },
      children: [run('나의 엔딩노트', { size: 48, bold: true, color: GREEN })] }),
    para([run([me.name, me.date].filter(Boolean).join(' · ') || ' ', { size: 24, color: '555555' })], { spacing: { after: 240 } }),
    para([run('이 노트는 남은 가족이 헤매지 않도록 제가 아는 것을 모아 둔 기록입니다. 법적 효력이 있는 유언장이 아닙니다.', { size: 20, color: '777777' })]),
  );

  let n = 0;
  for (const s of sections) {
    if (s.id === 'me') continue; // 이름·작성일은 맨 위에 이미 넣었습니다. 맡길 사람만 아래에서 따로 씁니다.
    const v = data[s.id];
    if (!v) continue;

    if (s.type === 'fields') {
      const filled = s.fields.filter((f) => (v[f.id] || '').trim());
      if (!filled.length) continue;
      body.push(heading(s.title, ++n));
      for (const f of filled) {
        body.push(para([run(f.label, { bold: true, color: GREEN })], { spacing: { after: 40 }, keepNext: true }));
        lines(v[f.id]).forEach((l) => body.push(para([run(l)])));
      }
    } else {
      const rows = (v || []).filter((r) => Object.values(r).some((x) => (x || '').trim()));
      if (!rows.length) continue;
      body.push(heading(s.title, ++n));
      body.push(listTable(s.cols, rows));
    }
  }

  if (me.keeper) {
    body.push(heading('이 노트에 대해', ++n));
    body.push(para([run('이 노트가 어디 있는지 아는 사람: ', { bold: true }), run(me.keeper)]));
  }

  body.push(para([run(' ')]), para([
    run('다정리(엔딩노트 작성기)로 만든 문서입니다. 작성 내용은 작성자의 기기에서만 처리되었습니다.', { size: 18, color: '999999' }),
  ]));

  const doc = new Document({
    creator: me.name || '',
    title: '나의 엔딩노트',
    styles: { default: { document: { run: { font: FONT, size: 22 } } } },
    sections: [{
      properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
      footers: {
        default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
          children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 18, color: '999999' })] })] }),
      },
      children: body,
    }],
  });

  const blob = await Packer.toBlob(doc);
  return embed(blob, data);
}

async function embed(blob, data) {
  const zip = await JSZip.loadAsync(blob);
  const types = await zip.file('[Content_Types].xml').async('string');
  if (!/Extension="json"/.test(types)) {
    zip.file('[Content_Types].xml', types.replace('<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="json" ContentType="application/json"/>'));
  }
  zip.file(DATA_PATH, JSON.stringify({ app: APP, v: 1, savedAt: new Date().toISOString(), data }));
  // 파일 목록(관계)에 등록해 두어야 Word가 "손상된 파일"로 보지 않습니다.
  const rels = await zip.file('_rels/.rels').async('string');
  if (!rels.includes(DATA_PATH)) {
    zip.file('_rels/.rels', rels.replace('</Relationships>',
      `<Relationship Id="rIdDajeongriNote" Type="https://dajeongri.com/rel/note-data" Target="${DATA_PATH}"/></Relationships>`));
  }
  return zip.generateAsync({
    type: 'blob', compression: 'DEFLATE',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
}

/**
 * 다정리에서 받은 Word 파일에서 이어 쓰기 정보를 꺼냅니다.
 * 알고 있는 항목·칸만 글자로 받아들이고 나머지는 버립니다.
 * 결과: { ok: true, data } 또는 { ok: false, reason: 'notzip' | 'nodata' }
 */
export async function readNoteFile(file, sections) {
  let zip;
  try { zip = await JSZip.loadAsync(file); } catch { return { ok: false, reason: 'notzip' }; }
  const f = zip.file(DATA_PATH);
  if (!f) return { ok: false, reason: 'nodata' };
  let raw;
  try { raw = JSON.parse(await f.async('string')); } catch { return { ok: false, reason: 'nodata' }; }
  if (!raw || raw.app !== APP || typeof raw.data !== 'object' || !raw.data) return { ok: false, reason: 'nodata' };
  const str = (x) => (typeof x === 'string' ? x.slice(0, 5000) : '');
  const data = {};
  for (const s of sections) {
    const v = raw.data[s.id];
    if (!v) continue;
    if (s.type === 'fields') {
      const o = {};
      for (const fd of s.fields) o[fd.id] = str(v[fd.id]);
      data[s.id] = o;
    } else if (Array.isArray(v)) {
      data[s.id] = v.slice(0, 200).map((r) => {
        const row = {};
        for (const c of s.cols) row[c.id] = str(r && r[c.id]);
        return row;
      });
    }
  }
  return { ok: true, data, savedAt: typeof raw.savedAt === 'string' ? raw.savedAt : '' };
}
