"""
다정리 그림 세트 만들기.

  python3 tools/illust.py   →   public/illust/*.svg

두 사람(부모님, 자녀)이 모든 장면에 같은 모습으로 나오도록, 사람 그리기를
함수로 만들어 두고 장면마다 위치와 자세만 바꿔 씁니다.
색은 사이트 색(남색 선, 크림색 바탕, 호박색 포인트)에 맞췄습니다.
그림을 고치려면 이 파일을 고친 뒤 다시 실행하세요. svg 파일을 직접 고치면
다음 실행 때 덮어써집니다.
"""
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / 'public' / 'illust'
OUT.mkdir(parents=True, exist_ok=True)

LINE = '#1E3A5A'
SKIN = '#FDEBDC'
BLUSH = '#F4B9A0'
CARDI = '#F3D29A'      # 부모님 가디건
CARDI_D = '#E8B866'
SWEAT = '#D9E6F4'      # 자녀 스웨터
SWEAT_D = '#B9CDE6'
HAIR_G = '#DCE3EB'     # 흰머리
HAIR_N = '#1E3A5A'     # 검은 머리
CREAM = '#FFF4E6'
WOOD = '#EED9BE'
WOOD_D = '#D9BC97'
AMBER = '#E8A13A'
MINT = '#2E9D7B'
LEAF = '#CFE6DA'
PAPER = '#FFFFFF'
SHADE = 'rgba(30,58,90,0.08)'


def svg(w, h, body, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img" aria-label="{title}" '
            f'fill="none" stroke="{LINE}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">'
            f'<title>{title}</title>{body}</svg>')


def g(x, y, s=1, inner='', flip=False):
    sx = -s if flip else s
    return f'<g transform="translate({x} {y}) scale({sx} {s})">{inner}</g>'


# ── 사람 ─────────────────────────────────────────────
def parent(arm='table', smile=True, eyes='open'):
    """부모님: 흰머리 짧은 머리, 동그란 안경, 단추 달린 가디건. 원점은 앉은 몸통 아래 가운데."""
    p = []
    # 몸통(가디건)과 안쪽 셔츠
    p.append(f'<path d="M-72 0C-70-58-44-94 0-94S70-58 72 0Z" fill="{CARDI}"/>')
    p.append(f'<path d="M-18-92 0-60 18-92" fill="{PAPER}"/>')
    p.append('<path d="M0-60V0" stroke-width="2"/>')
    for yy in (-46, -28, -10):
        p.append(f'<circle cx="7" cy="{yy}" r="2.6" fill="{LINE}" stroke="none"/>')
    p.append(f'<path d="M-40-30q8 6 18 4" stroke="{CARDI_D}" stroke-width="2"/>')  # 주머니 선
    # 목과 머리
    p.append(f'<path d="M-10-100v10h20v-10" fill="{SKIN}"/>')
    p.append(f'<ellipse cx="-36" cy="-134" rx="6" ry="8" fill="{SKIN}"/><ellipse cx="36" cy="-134" rx="6" ry="8" fill="{SKIN}"/>')
    p.append(f'<circle cx="0" cy="-138" r="36" fill="{SKIN}"/>')
    # 머리카락(흰머리, 살짝 웨이브)
    p.append(f'<path d="M-38-138c-4-30 14-50 38-50 26 0 42 18 38 48-6-12-14-18-24-20-8 6-20 8-32 4-8 4-14 10-20 18z" fill="{HAIR_G}"/>')
    p.append('<path d="M-14-170c6-4 14-4 20 0M8-174c6-2 12 0 16 4" stroke-width="1.8"/>')
    # 안경
    p.append(f'<circle cx="-14" cy="-134" r="10" fill="{PAPER}" fill-opacity="0.35"/><circle cx="14" cy="-134" r="10" fill="{PAPER}" fill-opacity="0.35"/><path d="M-4-134h8M-24-136l-11-3M24-136l11-3" stroke-width="2"/>')
    if eyes == 'open':
        p.append(f'<circle cx="-14" cy="-133" r="2.4" fill="{LINE}" stroke="none"/><circle cx="14" cy="-133" r="2.4" fill="{LINE}" stroke="none"/>')
    else:
        p.append('<path d="M-18-133q4 3 8 0M10-133q4 3 8 0" stroke-width="2"/>')
    p.append(f'<circle cx="-24" cy="-118" r="5" fill="{BLUSH}" stroke="none" opacity=".7"/><circle cx="24" cy="-118" r="5" fill="{BLUSH}" stroke="none" opacity=".7"/>')
    p.append('<path d="M-8-116q8 7 16 0" stroke-width="2.2"/>' if smile else '<path d="M-7-114h14" stroke-width="2.2"/>')
    p.append('<path d="M-22-150q8-4 14-1M8-151q8-3 14 1" stroke-width="1.8"/>')  # 눈썹
    # 팔
    if arm == 'table':      # 두 팔을 탁자 위로
        p.append(f'<path d="M-62-40c-8 20-6 32 6 40h28" fill="{CARDI}"/><path d="M62-40c8 20 6 32-6 40h-28" fill="{CARDI}"/>')
    elif arm == 'write':    # 오른손으로 펜
        p.append(f'<path d="M-62-40c-8 20-6 32 6 40h28" fill="{CARDI}"/>')
        p.append(f'<path d="M60-44c14 14 26 28 40 36l-10 12c-18-6-34-18-44-30" fill="{CARDI}"/>')
        p.append(f'<circle cx="100" cy="-4" r="9" fill="{SKIN}"/>')
        p.append(f'<path d="M98-10l22-26" stroke="{AMBER}" stroke-width="4"/>')
    elif arm == 'hold':     # 무릎 위 공책
        p.append(f'<path d="M-62-40c-6 18-2 30 14 34l40-2" fill="{CARDI}"/><path d="M62-40c6 18 2 30-14 34l-40-2" fill="{CARDI}"/>')
    return ''.join(p)


def child(arm='table', smile=True):
    """자녀: 검은 머리 가르마, 하늘색 스웨터(목 줄무늬)."""
    p = []
    p.append(f'<path d="M-70 0C-68-56-42-90 0-90S68-56 70 0Z" fill="{SWEAT}"/>')
    p.append(f'<path d="M-20-88q20 14 40 0" stroke="{SWEAT_D}" stroke-width="5"/>')
    p.append('<path d="M-20-88q20 14 40 0" stroke-width="2"/>')
    p.append(f'<path d="M-30-40v34M30-40v34" stroke="{SWEAT_D}" stroke-width="2"/>')
    p.append(f'<path d="M-9-98v10h18v-10" fill="{SKIN}"/>')
    p.append(f'<ellipse cx="-34" cy="-132" rx="6" ry="8" fill="{SKIN}"/><ellipse cx="34" cy="-132" rx="6" ry="8" fill="{SKIN}"/>')
    p.append(f'<circle cx="0" cy="-136" r="34" fill="{SKIN}"/>')
    p.append(f'<path d="M-36-134c-6-34 16-52 38-52 26 0 40 20 34 50-4-14-10-22-18-26-14 10-34 14-54 28z" fill="{HAIR_N}"/>')
    p.append(f'<circle cx="-12" cy="-130" r="2.6" fill="{LINE}" stroke="none"/><circle cx="14" cy="-130" r="2.6" fill="{LINE}" stroke="none"/>')
    p.append('<path d="M-19-142q7-4 13-1M8-143q7-3 13 1" stroke-width="1.8"/>')
    p.append(f'<circle cx="-22" cy="-118" r="5" fill="{BLUSH}" stroke="none" opacity=".7"/><circle cx="24" cy="-118" r="5" fill="{BLUSH}" stroke="none" opacity=".7"/>')
    p.append('<path d="M-6-114q7 6 14 0" stroke-width="2.2"/>' if smile else '<path d="M-6-112h12" stroke-width="2.2"/>')
    if arm == 'table':
        p.append(f'<path d="M-60-40c-8 20-6 32 6 40h28" fill="{SWEAT}"/><path d="M60-40c8 20 6 32-6 40h-28" fill="{SWEAT}"/>')
    elif arm == 'point':
        p.append(f'<path d="M-60-40c-8 20-6 32 6 40h28" fill="{SWEAT}"/>')
        p.append(f'<path d="M58-46c16 8 30 14 46 16l-2 14c-18 0-36-6-50-14" fill="{SWEAT}"/><circle cx="108" cy="-24" r="8" fill="{SKIN}"/>')
    elif arm == 'phone':
        p.append(f'<path d="M-60-40c-6 18-2 30 14 34l40-2" fill="{SWEAT}"/><path d="M60-40c6 18 2 30-14 34l-40-2" fill="{SWEAT}"/>')
        p.append(f'<rect x="-12" y="-30" width="26" height="40" rx="5" fill="{LINE}" transform="rotate(-14)"/><rect x="-8" y="-26" width="18" height="30" rx="3" fill="{PAPER}" stroke="none" transform="rotate(-14)"/>')
    return ''.join(p)


# ── 소품 ─────────────────────────────────────────────
def mug(x, y, steam=True, color=PAPER, band=AMBER):
    s = f'<g transform="translate({x} {y})"><path d="M-18-28h36v22c0 10-8 14-18 14S-18 4-18-6z" fill="{color}"/>'
    s += f'<path d="M-18-18h36" stroke="{band}" stroke-width="4"/><path d="M-18-18h36" stroke-width="0"/>'
    s += '<path d="M18-22c12 0 12 14 0 14"/>'
    if steam:
        s += f'<path d="M-8-36c-5-6 5-9 0-16M6-36c-5-6 5-9 0-16" stroke="{AMBER}" stroke-width="2.2"/>'
    return s + '</g>'


def plant(x, y, s=1):
    inner = (f'<path d="M-22 0h44l-6 42h-32z" fill="{CARDI}"/><path d="M-22 10h44" stroke-width="2"/>'
             f'<path d="M0 0c-2-34 4-60 20-82"/>'
             f'<path d="M2-20c-18-6-30-20-32-40 18 4 30 18 32 40z" fill="{LEAF}"/><path d="M2-20c-10-10-18-22-26-34" stroke-width="1.6"/>'
             f'<path d="M6-44c14-10 22-26 22-44-14 8-22 24-22 44z" fill="{LEAF}"/><path d="M6-44c6-12 12-26 18-38" stroke-width="1.6"/>'
             f'<path d="M14-66c-14-6-20-18-20-32 12 4 20 16 20 32z" fill="{LEAF}"/>')
    return g(x, y, s, inner)


def notebook(x, y, s=1, open_=True, rot=0):
    if open_:
        inner = (f'<path d="M-70 0l14-34h56l-4 34z" fill="{PAPER}"/><path d="M-4 0l4-34h56l14 34z" fill="{PAPER}"/>'
                 f'<path d="M-50-24h40M-54-14h40M-58-4h32M10-24h38M10-14h42M12-4h28" stroke-width="1.8"/>'
                 f'<path d="M-2-34v34" stroke-width="2"/><path d="M40-34v14l5-4 5 4v-14" fill="{AMBER}" stroke-width="1.6"/>')
    else:
        inner = (f'<rect x="-46" y="-60" width="92" height="120" rx="8" fill="{LINE}"/><rect x="-40" y="-56" width="80" height="112" rx="6" fill="#2C5282" stroke="none"/>'
                 f'<rect x="-26" y="-34" width="52" height="22" rx="4" fill="{CREAM}" stroke="none"/><path d="M-18-23h36" stroke="{LINE}" stroke-width="2"/>'
                 f'<path d="M24-60v52l7-6 7 6v-52" fill="{AMBER}" stroke="none"/>')
    return f'<g transform="translate({x} {y}) rotate({rot}) scale({s})">{inner}</g>'


def window(x, y, w=150, h=110, sun=True, curtain=True):
    s = f'<g transform="translate({x} {y})"><rect x="0" y="0" width="{w}" height="{h}" rx="10" fill="#FFFFFF"/>'
    s += f'<rect x="8" y="8" width="{w-16}" height="{h-16}" rx="6" fill="#EAF2FA" stroke="none"/>'
    if sun:
        s += f'<circle cx="{w*0.68}" cy="{h*0.36}" r="13" fill="{AMBER}" stroke="none"/>'
        s += f'<path d="M{w*0.2} {h*0.62}q14-10 26 0 10-8 22 0" stroke="#FFFFFF" stroke-width="5"/>'
    s += f'<path d="M{w/2} 0v{h}M0 {h/2}h{w}"/>'
    if curtain:
        s += f'<path d="M-14-6q10 50 0 {h+16}h18q-12-60 0-{h+16}z" fill="{CARDI}"/><path d="M{w+14}-6q-10 50 0 {h+16}h-18q12-60 0-{h+16}z" fill="{CARDI}"/>'
        s += f'<path d="M-20-8h{w+40}" stroke-width="3"/>'
    return s + '</g>'


def lamp(x, y, l=60):
    return (f'<g transform="translate({x} {y})"><path d="M0 0v{l}"/><path d="M-30 {l+28}q30-40 60 0z" fill="{AMBER}"/>'
            f'<path d="M-30 {l+28}h60"/><circle cx="0" cy="{l+34}" r="5" fill="#FFF0C8"/></g>')


def table(x1, x2, y, legs=True, cloth=True):
    s = f'<rect x="{x1}" y="{y}" width="{x2-x1}" height="14" rx="4" fill="{WOOD}"/>'
    if cloth:
        mid = (x1 + x2) / 2
        s += f'<path d="M{mid-120} {y}h240l-14 34h-212z" fill="#FFFFFF"/>'
        s += ''.join(f'<path d="M{mid-110+i*24} {y+6}l-4 22" stroke="{SWEAT_D}" stroke-width="2"/>' for i in range(10))
    if legs:
        s += f'<path d="M{x1+24} {y+14}v70M{x2-24} {y+14}v70" stroke-width="3"/>'
    return s


def rug(cx, y, w=380):
    return (f'<ellipse cx="{cx}" cy="{y}" rx="{w/2}" ry="16" fill="{SHADE}" stroke="none"/>')


def heart(x, y, s=1, fill=AMBER):
    return g(x, y, s, f'<path d="M0 8C-10 1-14-4-14-9a7 7 0 0 1 14-3 7 7 0 0 1 14 3c0 5-4 10-14 17z" fill="{fill}" stroke="none"/>')


def chair(x, y, s=1, flip=False):
    inner = (f'<path d="M-40-150q40-16 80 0v110h-80z" fill="{WOOD}"/><path d="M-40-110h80M-40-70h80" stroke="{WOOD_D}" stroke-width="2"/>'
             f'<path d="M-50-40h100v14h-100z" fill="{WOOD}"/><path d="M-42-26v60M42-26v60" stroke-width="3"/>')
    return g(x, y, s, inner, flip)


# ── 장면 ─────────────────────────────────────────────
scenes = {}

# 1. 첫 화면: 식탁에 마주 앉아 함께 쓰기
b = []
b.append(f'<rect x="0" y="0" width="640" height="420" fill="{CREAM}" stroke="none"/>')
b.append(f'<path d="M0 300h640v120H0z" fill="#FBE9D2" stroke="none"/>')
b.append(window(245, 40, 150, 112))
b.append(f'<rect x="56" y="70" width="70" height="88" rx="6" fill="#FFFFFF"/><rect x="64" y="78" width="54" height="56" rx="3" fill="{LEAF}" stroke="none"/><path d="M70 126l14-18 10 10 8-8 10 16z" fill="{MINT}" stroke="none" opacity=".6"/><circle cx="104" cy="92" r="6" fill="{AMBER}" stroke="none"/><path d="M76 146h30" stroke-width="2"/>')
b.append(f'<path d="M512 60h80v58h-80z" fill="#FFFFFF"/><path d="M522 74h60M522 86h44M522 98h52" stroke-width="2"/><path d="M552 52v8" />')
b.append(rug(320, 404, 520))
b.append(g(196, 300, 1, parent('table')))
b.append(g(446, 300, 1, child('table')))
b.append(table(70, 570, 296, cloth=False))
b.append(notebook(318, 294, 1.0))
b.append(f'<path d="M352 288l30-30" stroke="{AMBER}" stroke-width="4.5"/><path d="M382 258l4-4" stroke-width="3"/>')
b.append(mug(150, 294))
b.append(mug(500, 294, steam=False, color=SWEAT, band=PAPER))
b.append(plant(600, 300, 0.9))
b.append(heart(306, 214, 0.9))
scenes['hero-table'] = (640, 420, ''.join(b), '부모님과 자녀가 식탁에 마주 앉아 엔딩노트를 함께 쓰는 그림')

# 2. 편지 쓰기
b = [f'<rect width="420" height="320" fill="{CREAM}" stroke="none"/>', rug(210, 304, 340)]
b.append(lamp(320, -2, 70))
b.append(g(170, 250, 1, parent('write', eyes='closed')))
b.append(table(40, 400, 246, cloth=False))
b.append(f'<g transform="translate(286 244) rotate(-6)"><path d="M-56 0l8-44h96l-8 44z" fill="{PAPER}"/><path d="M-40-30h70M-42-20h66M-44-10h40" stroke-width="1.8"/></g>')
b.append(heart(318, 228, 0.8))
b.append(mug(80, 244, steam=True))
b.append(f'<path d="M346 244h40v-16h-40z" fill="{SWEAT}"/><path d="M350 228h32v-10h-32z" fill="{CARDI}"/>')
scenes['letter'] = (420, 320, ''.join(b), '부모님이 책상에서 편지를 쓰는 그림')

# 3. 나를 위해 미리: 혼자 차분히 공책 정리
b = [f'<rect width="320" height="240" fill="{CREAM}" stroke="none"/>', rug(160, 228, 240)]
b.append(f'<rect x="196" y="28" width="92" height="70" rx="6" fill="#FFFFFF"/><path d="M196 46h92" stroke-width="2"/>' + ''.join(f'<rect x="{204+(i%5)*16}" y="{54+(i//5)*14}" width="10" height="8" rx="2" fill="{AMBER if i==7 else LEAF}" stroke="none"/>' for i in range(15)))
b.append(g(130, 214, 0.9, parent('hold')))
b.append(notebook(130, 212, 0.62, rot=-4))
b.append(mug(250, 214))
b.append(f'<path d="M210 214h80" stroke-width="3"/><path d="M220 214v14M280 214v14" stroke-width="2.6"/>')
scenes['situ-me'] = (320, 240, ''.join(b), '혼자 공책을 펴고 정리하는 그림')

# 4. 부모님과 함께: 소파에 나란히, 휴대폰 사진 보기
b = [f'<rect width="320" height="240" fill="{CREAM}" stroke="none"/>', rug(160, 230, 260)]
b.append(f'<path d="M24 210v-70q0-20 20-20h232q20 0 20 20v70z" fill="{SWEAT_D}"/><path d="M24 210h272v18H24z" fill="{SWEAT}"/>')
b.append(g(118, 214, 0.82, parent('hold')))
b.append(g(208, 214, 0.82, child('phone')))
b.append(heart(162, 70, 0.8))
scenes['situ-parents'] = (320, 240, ''.join(b), '부모님과 자녀가 소파에 나란히 앉아 휴대폰을 보는 그림')

# 5. 시간이 많지 않아요: 자녀가 부모님 어깨를 감싸 안은 모습
b = [f'<rect width="320" height="240" fill="{CREAM}" stroke="none"/>', rug(160, 232, 240)]
b.append(window(206, 22, 92, 70, sun=True, curtain=False))
b.append(g(132, 236, 0.9, parent('hold', eyes='closed')))
b.append(g(214, 236, 0.9, child('table')))
b.append(f'<path d="M176 168c-30-20-64-26-96-14" stroke-width="0"/>')
b.append(f'<path d="M190 160c-26-16-60-22-92-10l4 16c26-8 52-6 76 6z" fill="{SWEAT}"/>')
b.append(f'<circle cx="96" cy="160" r="9" fill="{SKIN}"/>')
b.append(heart(172, 64, 1.0))
scenes['situ-time'] = (320, 240, ''.join(b), '자녀가 부모님 어깨를 감싸 안은 그림')

# 6. 가족을 떠나보냈어요: 빈 의자와 걸쳐 둔 가디건, 찻잔 (얼굴 없음)
b = [f'<rect width="320" height="240" fill="#F4F1EC" stroke="none"/>', rug(170, 228, 220)]
b.append(window(190, 26, 100, 80, sun=False, curtain=False))
b.append(f'<path d="M84 64v132M156 64v132" stroke-width="4"/><path d="M80 64h80" stroke-width="5"/><path d="M84 92h72M84 120h72" stroke="{WOOD_D}" stroke-width="3"/>')
b.append(f'<path d="M72 150h96v12H72z" fill="{WOOD}"/><path d="M80 162v52M160 162v52" stroke-width="3"/>')
b.append(f'<path d="M88 62q32-12 64 0v40q-6 10-14 6l-4-30-12 46h-8l-10-46-4 30q-8 4-12-6z" fill="{CARDI}"/><path d="M120 60v52" stroke-width="2"/><circle cx="126" cy="76" r="2.4" fill="{LINE}" stroke="none"/><circle cx="126" cy="92" r="2.4" fill="{LINE}" stroke="none"/>')
b.append(f'<path d="M200 196h80" stroke-width="3"/><path d="M212 196v30M268 196v30" stroke-width="2.6"/>')
b.append(mug(240, 194, steam=False))
b.append(f'<path d="M262 194c0-10 6-16 12-16" stroke="{MINT}" stroke-width="2.4"/><circle cx="276" cy="176" r="5" fill="{LEAF}"/>')
scenes['situ-after'] = (320, 240, ''.join(b), '가디건이 걸린 빈 의자와 찻잔이 놓인 조용한 그림')

# 7. 3분 진단: 갈림길 표지판과 징검돌
b = [f'<rect width="320" height="240" fill="{CREAM}" stroke="none"/>']
b.append(f'<path d="M0 190q160-30 320 0v50H0z" fill="#FBE9D2" stroke="none"/>')
for i, (cx, cy) in enumerate([(60, 214), (120, 200), (182, 192)]):
    b.append(f'<ellipse cx="{cx}" cy="{cy}" rx="26" ry="9" fill="#FFFFFF"/>')
b.append('<path d="M232 196V60" stroke-width="4"/>')
b.append(f'<path d="M232 72h66l14 14-14 14h-66z" fill="{SWEAT}"/><path d="M244 86h44" stroke-width="2"/>')
b.append(f'<path d="M232 110h-66l-14 14 14 14h66z" fill="{CARDI}"/><path d="M178 124h44" stroke-width="2"/>')
b.append(f'<path d="M232 148h52l12 12-12 12h-52z" fill="{LEAF}"/><path d="M244 160h32" stroke-width="2"/>')
b.append(g(82, 186, 0.62, child('point')))
scenes['quiz'] = (320, 240, ''.join(b), '갈림길 표지판 앞에서 길을 가리키는 그림')

# 8. 완료·빈 화면: 리본 달린 공책과 체크 표시
b = [f'<rect width="320" height="240" fill="{CREAM}" stroke="none"/>', rug(160, 214, 200)]
b.append(notebook(150, 140, 1.0, open_=False, rot=-6))
b.append(f'<circle cx="214" cy="80" r="26" fill="{MINT}" stroke="none"/><path d="M202 80l8 8 16-16" stroke="#FFFFFF" stroke-width="4"/>')
b.append(plant(258, 196, 0.7))
b.append(mug(74, 206, steam=True))
scenes['done'] = (320, 240, ''.join(b), '리본 달린 공책과 완료 표시')

# 9. 카드: 휴대폰 잠금과 지갑 카드
b = [f'<rect width="320" height="240" fill="{CREAM}" stroke="none"/>', rug(160, 222, 220)]
b.append(f'<rect x="70" y="40" width="88" height="170" rx="16" fill="{LINE}"/><rect x="78" y="56" width="72" height="136" rx="8" fill="#EAF2FA" stroke="none"/>')
b.append(f'<rect x="100" y="104" width="28" height="22" rx="4" fill="{AMBER}"/><path d="M106 104v-8a8 8 0 0 1 16 0v8"/>')
b.append(''.join(f'<circle cx="{98+(i%3)*16}" cy="{142+(i//3)*14}" r="3" fill="{LINE}" stroke="none"/>' for i in range(6)))
b.append(f'<g transform="translate(206 140) rotate(8)"><rect x="-62" y="-40" width="124" height="80" rx="10" fill="{PAPER}"/><rect x="-62" y="-40" width="124" height="20" rx="10" fill="{CARDI}"/><path d="M-62-24h124" stroke-width="2"/><path d="M-48-6h60M-48 8h80M-48 22h44" stroke-width="2"/>{heart(44, 14, 0.7)}</g>')
scenes['cards'] = (320, 240, ''.join(b), '잠긴 휴대폰과 지갑에 넣는 연락 카드')

# 10. 혼자 사는 분: 창가의 부모님과 고양이
b = [f'<rect width="320" height="240" fill="{CREAM}" stroke="none"/>', rug(160, 230, 240)]
b.append(window(170, 24, 120, 92, sun=True, curtain=True))
b.append(chair(110, 214, 0.85, flip=True))
b.append(g(110, 196, 0.8, parent('hold')))
b.append(notebook(110, 194, 0.5, rot=-4))
b.append(f'<g transform="translate(238 212)"><path d="M-24 0c0-20 10-32 24-32s24 12 24 32z" fill="{CARDI_D}"/><circle cx="0" cy="-40" r="14" fill="{CARDI_D}"/><path d="M-11-50l2-12 8 8M11-50l-2-12-8 8" fill="{CARDI_D}"/><path d="M24-4c14 0 18-12 10-20" /><path d="M-5-40h0M5-40h0" stroke-width="4"/></g>')
scenes['alone'] = (320, 240, ''.join(b), '창가에 앉은 부모님과 고양이')

# 11. 묘지와 안치: 언덕 위 나무와 작은 표지
b = [f'<rect width="320" height="240" fill="#EEF4F8" stroke="none"/>']
b.append(f'<circle cx="250" cy="56" r="18" fill="{AMBER}" stroke="none" opacity=".85"/>')
b.append(f'<path d="M0 180q100-70 200-30t120 10v80H0z" fill="{LEAF}"/>')
b.append(f'<path d="M140 150v-56" stroke-width="5"/><path d="M140 118l-18-14M140 106l16-12"/>')
b.append(f'<path d="M140 30c-34 0-56 22-52 50 2 18 22 28 52 28s50-10 52-28c4-28-18-50-52-50z" fill="#BFDCCB"/><path d="M110 70q14-8 26 0M138 52q14-8 26 0M150 84q12-6 22 0" stroke-width="1.8"/>')
b.append(f'<rect x="160" y="150" width="26" height="18" rx="3" fill="{PAPER}"/><path d="M166 158h14" stroke-width="1.8"/>')
b.append(f'<path d="M60 70q6-6 12 0M78 60q6-6 12 0" stroke-width="2"/>')
b.append(f'<g transform="translate(220 196)">' + ''.join(f'<path d="M{i*14} 0q2-10 6-12" stroke="{MINT}" stroke-width="2"/>' for i in range(5)) + '</g>')
scenes['burial'] = (320, 240, ''.join(b), '언덕 위 나무 아래 작은 표지가 있는 그림')

# 12. 비용 알아보기: 계산기와 영수증
b = [f'<rect width="320" height="240" fill="{CREAM}" stroke="none"/>', rug(160, 222, 220)]
b.append(f'<g transform="translate(120 128) rotate(-6)"><path d="M-50-80h100v150l-12-8-12 8-13-8-13 8-12-8-13 8-12-8-13 8z" fill="{PAPER}"/><path d="M-34-56h68M-34-40h52M-34-24h60M-34-8h40" stroke-width="2"/><path d="M-34 14h68" stroke-width="2.6"/><path d="M10 30h24" stroke="{AMBER}" stroke-width="4"/></g>')
b.append(f'<g transform="translate(224 140) rotate(6)"><rect x="-44" y="-64" width="88" height="124" rx="12" fill="{SWEAT}"/><rect x="-32" y="-52" width="64" height="26" rx="5" fill="{PAPER}"/><path d="M-4-39h26" stroke-width="2"/>' + ''.join(f'<rect x="{-32+(i%3)*24}" y="{-16+(i//3)*22}" width="16" height="14" rx="4" fill="{AMBER if i==8 else PAPER}"/>' for i in range(9)) + '</g>')
scenes['costs'] = (320, 240, ''.join(b), '영수증과 계산기')

for name, (w, h, body, title) in scenes.items():
    (OUT / f'{name}.svg').write_text(svg(w, h, body, title), encoding='utf-8')
print('그림', len(scenes), '장 →', OUT)
