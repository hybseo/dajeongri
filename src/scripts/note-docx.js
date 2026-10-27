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

  return Packer.toBlob(doc);
}
