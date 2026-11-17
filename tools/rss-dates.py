#!/usr/bin/env python3
"""
RSS 글 날짜 채우기 (2026-11-17)

/rss.xml 의 각 글에는 "처음 올린 날"이 들어갑니다. 날짜는 src/data/rss-dates.json 에 적혀 있고,
이 스크립트가 깃 기록에서 페이지가 처음 생긴 날을 찾아 빈 칸만 채웁니다(이미 있는 날짜는 건드리지 않음).

    npm run build              # 먼저 빌드해서 dist/sitemap.xml 을 만들고
    python3 tools/rss-dates.py # 새 페이지의 날짜를 채운 뒤 함께 올립니다

날짜가 없는 페이지는 RSS 에서 빠지고, 빌드할 때 "[dajeongri-rss] 날짜 없음" 경고가 나옵니다.
깃 기록으로 못 찾은 페이지는 오늘 날짜로 채웁니다(새로 만든 페이지라는 뜻).
"""
import json, re, subprocess, sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'src' / 'data' / 'rss-dates.json'
SITEMAP = ROOT / 'dist' / 'sitemap.xml'


def git(*args):
    return subprocess.run(['git', *args], cwd=ROOT, capture_output=True, text=True).stdout.strip()


def first_commit_date(args):
    out = git('log', '--reverse', '--format=%ad', '--date=format:%Y-%m-%d', *args)
    return out.splitlines()[0] if out else None


def source_date(path):
    """이 주소를 만드는 원본이 처음 생긴 날."""
    p = path.strip('/')
    # 1) 원고(content.json)에서 온 페이지: 그 주소 문자열이 처음 들어간 날
    d = first_commit_date(['-S', f'"url": "{path}"', '--', 'src/data/content.json'])
    if d:
        return d
    # 2) 장례식장 지역 페이지: 지역 페이지 파일이 처음 생긴 날
    if p.startswith('tools/funeral-homes/') and p.count('/') == 2:
        return first_commit_date(['--diff-filter=A', '--', 'src/pages/tools/funeral-homes/[sido].astro'])
    # 3) 파일로 된 페이지: 그 파일이 처음 생긴 날
    for cand in [f'src/pages/{p}.astro', f'src/pages/{p}/index.astro']:
        d = first_commit_date(['--diff-filter=A', '--', cand])
        if d:
            return d
    return None


def main():
    if not SITEMAP.exists():
        sys.exit('dist/sitemap.xml 이 없습니다. 먼저 npm run build 를 하세요.')
    paths = [re.sub(r'^https?://[^/]+', '', u) for u in re.findall(r'<loc>([^<]+)</loc>', SITEMAP.read_text(encoding='utf-8'))]
    data = json.loads(OUT.read_text(encoding='utf-8')) if OUT.exists() else {}
    added = []
    for p in paths:
        if p in data:
            continue
        data[p] = source_date(p) or date.today().isoformat()
        added.append(f'{p} {data[p]}')
    OUT.write_text(json.dumps(dict(sorted(data.items())), ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'{len(added)}개 채움' + (':\n  ' + '\n  '.join(added) if added else ''))


if __name__ == '__main__':
    main()
