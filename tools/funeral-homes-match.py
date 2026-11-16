#!/usr/bin/env python3
"""
장례식장 찾기 ↔ e하늘 시설번호 맞추기 (2026-11-16)

src/data/funeral-homes.json(보건복지부 자료)의 장례식장마다 e하늘 시설번호(facilitycd)를 찾아
"eh" 칸에 적습니다. 카드의 "가격 보기(e하늘)" 버튼이 이 번호로 그 장례식장 가격 화면을 바로 엽니다.

    python3 tools/funeral-homes-match.py

e하늘 목록은 src/data/ehaneul-facilities.json 입니다(이름·주소·전화·번호만, 가격 없음).
보건복지부 자료를 새로 받은 뒤(funeral-homes-import.py) 이 스크립트를 다시 돌리세요.
e하늘 목록을 새로 받으려면 e하늘 장례식장 목록 화면이 쓰는 fac_list.ajax 결과에서 같은 칸을 모으면 됩니다.

맞추는 규칙 (확실한 것만 연결하고, 애매하면 비워 둡니다 → 화면은 e하늘 목록으로 안내):
  1. 이름이 같고(공백·(주)·괄호 안 글자 무시) 시군구·도로명주소·전화 중 하나가 같음
  2. 1이 없으면 도로명주소(○○로 123)가 같고 시군구가 같음 — 운영사가 바뀌어 이름만 달라진 경우
  3. 1·2가 없으면 전화번호가 같고 이름이 절반 이상 비슷함
  후보가 둘 이상이면 이름과 도로명주소가 모두 같은 하나만 고르고, 아니면 비웁니다.
  한 e하늘 번호가 두 곳에 붙으면 둘 다 비웁니다.
"""
import collections, difflib, json, re
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / 'src' / 'data'
FH, EH = DATA / 'funeral-homes.json', DATA / 'ehaneul-facilities.json'


def nname(s):
    s = re.sub(r'\(주\)|㈜|주식회사|\(재\)|재단법인|사회복지법인|의료법인|\(의\)', '', s or '')
    s = re.sub(r'\([^)]*\)', '', s)
    return re.sub(r'[\s·.,\-]', '', s)


def ntel(s):
    return re.sub(r'\D', '', s or '')


def road(a):
    a = re.sub(r'\([^)]*\)', '', a or '')
    m = re.search(r'([가-힣A-Za-z0-9]+(?:로|길))\s*(\d+(?:-\d+)?)', a)
    return f'{m.group(1)} {m.group(2)}' if m else None


def sgg(a):
    p = (a or '').split()
    return p[1] if len(p) > 1 else ''


def main():
    fh = json.loads(FH.read_text(encoding='utf-8'))
    eh = json.loads(EH.read_text(encoding='utf-8'))
    E = [dict(cd=r['cd'], nn=nname(r['name']), road=road(r['addr']), tel=ntel(r['tel']), sgg=sgg(r['addr'])) for r in eh['items']]
    byname, bytel, byroad = (collections.defaultdict(list) for _ in range(3))
    for e in E:
        byname[e['nn']].append(e)
        if e['tel']:
            bytel[e['tel']].append(e)
        if e['road']:
            byroad[e['road']].append(e)

    found = []
    for o in fh['items']:
        nn, t, rd, s = nname(o['name']), ntel(o['tel']), road(o['addr']), o['sgg'].split()[0]
        c = {e['cd']: e for e in byname.get(nn, []) if e['sgg'] == s or e['road'] == rd or e['tel'] == t}
        if not c and rd:
            c = {e['cd']: e for e in byroad.get(rd, []) if e['sgg'] == s}
        if not c and t:
            c = {e['cd']: e for e in bytel.get(t, []) if difflib.SequenceMatcher(None, nn, e['nn']).ratio() >= 0.5 or e['road'] == rd}
        if len(c) > 1:
            best = [e for e in c.values() if e['nn'] == nn and e['road'] == rd]
            c = {best[0]['cd']: best[0]} if len(best) == 1 else {}
        found.append(next(iter(c)) if len(c) == 1 else None)

    dup = {cd for cd, n in collections.Counter(x for x in found if x).items() if n > 1}
    for o, cd in zip(fh['items'], found):
        o['eh'] = cd if cd and cd not in dup else ''
    fh['meta']['ehaneul'] = {'fetched': eh['meta']['fetched'], 'matched': sum(1 for o in fh['items'] if o['eh'])}
    FH.write_text(json.dumps(fh, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    miss = [o['name'] for o in fh['items'] if not o['eh']]
    print(f"e하늘 번호를 붙인 곳 {len(fh['items']) - len(miss)} / {len(fh['items'])}")
    for n in miss:
        print('  못 찾음:', n)


if __name__ == '__main__':
    main()
