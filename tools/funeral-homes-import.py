#!/usr/bin/env python3
"""
장례식장 찾기 자료 바꾸기 (2026-11-16)

공공데이터포털 「보건복지부_장례식장 현황」 CSV(https://www.data.go.kr/data/15143467/fileData.do)를 받아
src/data/funeral-homes.json 으로 바꿉니다.

    python3 tools/funeral-homes-import.py 받은파일.csv 2027-04-01

두 번째 값은 자료 기준일(파일 이름 끝의 날짜)입니다. 포털 CSV는 보통 EUC-KR(CP949)이라 그대로 읽고,
UTF-8 파일도 읽습니다. 칸 이름이 바뀌면 멈추니, 그때는 COLS 를 새 이름에 맞춰 고치세요.
"""
import csv, io, json, re, sys
from datetime import date
from pathlib import Path

COLS = ['시도', '시군구', '시설명', '주소', '전화번호', '팩스번호', '홈페이지', '주차가능대수', '공-사설구분',
        '빈소수', '안치가능구수', '식당', '매점', '주차장', '유족대기실', '장애인편의시설', '운영종류']
FAC = ['식당', '매점', '주차장', '유족대기실', '장애인편의시설']
OUT = Path(__file__).resolve().parent.parent / 'src' / 'data' / 'funeral-homes.json'


def read(path):
    b = Path(path).read_bytes()
    for enc in ('utf-8-sig', 'cp949'):
        try:
            return b.decode(enc)
        except UnicodeDecodeError:
            pass
    sys.exit('파일 글자 방식을 읽지 못했습니다(UTF-8, EUC-KR 아님).')


def num(v):
    v = re.sub(r'[^\d]', '', v or '')
    return int(v) if v else 0


def main():
    if len(sys.argv) != 3 or not re.fullmatch(r'\d{4}-\d{2}-\d{2}', sys.argv[2]):
        sys.exit(__doc__)
    rows = list(csv.DictReader(io.StringIO(read(sys.argv[1]))))
    if not rows or [c.strip() for c in rows[0].keys()] != COLS:
        sys.exit(f'칸 이름이 다릅니다: {list(rows[0].keys()) if rows else "빈 파일"}')
    clean = lambda s: re.sub(r'\s+', ' ', (s or '')).strip()
    items = []
    for r in rows:
        r = {k.strip(): clean(v) for k, v in r.items()}
        if not r['시설명']:
            continue
        items.append({
            'sido': r['시도'], 'sgg': r['시군구'], 'name': r['시설명'], 'addr': r['주소'], 'tel': r['전화번호'],
            'web': r['홈페이지'], 'parking': num(r['주차가능대수']), 'public': r['공-사설구분'] == '공설',
            'rooms': num(r['빈소수']), 'morgue': num(r['안치가능구수']),
            'f': ''.join('1' if r[k] == '설치' else '0' for k in FAC),
            'op': {'병원': 'H', '전문': 'P'}.get(r['운영종류'], ''),
        })
    old = json.loads(OUT.read_text(encoding='utf-8'))['meta'] if OUT.exists() else {}
    meta = {**old, 'asOf': sys.argv[2], 'fetched': date.today().isoformat(), 'count': len(items)}
    OUT.write_text(json.dumps({'meta': meta, 'items': items}, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print(f'{len(items)}곳을 {OUT} 에 썼습니다. 기준일 {sys.argv[2]}')


if __name__ == '__main__':
    main()
