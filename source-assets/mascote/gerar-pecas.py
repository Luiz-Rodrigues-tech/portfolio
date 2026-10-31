"""Recorta o castor da imagem de referência em peças para animar.

Uso: python source-assets/mascote/gerar-pecas.py
Saída: public/img/mascot/*.webp e src/components/mascot/layers.js

Todas as coordenadas abaixo estão em pixels da imagem original (704x506).
"""
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'source-assets' / 'mascote' / 'castor-referencia.png'
OUT = ROOT / 'public' / 'img' / 'mascot'
LAYERS_JS = ROOT / 'src' / 'components' / 'mascot' / 'layers.js'

SCALE = 2
X0, Y0, X1, Y1 = 12, 40, 350, 482      # área do castor da esquerda
SUNGLASSES_DX = 351                    # o castor da direita é igual, deslocado em x


def pts(points):
    return np.array([[(x - X0) * SCALE, (y - Y0) * SCALE] for x, y in points], np.int32)


def poly_mask(shape, points, feather=0):
    mask = np.zeros(shape[:2], np.uint8)
    cv2.fillPoly(mask, [pts(points)], 255, cv2.LINE_AA)
    if feather:
        k = feather * 2 + 1
        mask = cv2.GaussianBlur(mask, (k, k), 0)
    return mask


def upscale(image):
    return cv2.resize(image, None, fx=SCALE, fy=SCALE, interpolation=cv2.INTER_LANCZOS4)


def white_matte(bgr):
    """Tira o fundo branco e remove a contaminação de branco nas pontas do pelo."""
    whiteness = bgr.min(axis=2)
    near_white = (whiteness >= 232).astype(np.uint8)
    h, w = near_white.shape
    flood = near_white.copy()
    mask = np.zeros((h + 2, w + 2), np.uint8)
    for x in range(w):
        for y in (0, h - 1):
            if flood[y, x] == 1:
                cv2.floodFill(flood, mask, (x, y), 2)
    for y in range(h):
        for x in (0, w - 1):
            if flood[y, x] == 1:
                cv2.floodFill(flood, mask, (x, y), 2)
    background = (flood == 2).astype(np.uint8)

    band = cv2.dilate(background, np.ones((9, 9), np.uint8)).astype(bool)
    alpha = np.ones((h, w), np.float32)
    soft = np.clip((248.0 - whiteness) / 62.0, 0, 1).astype(np.float32)
    alpha[band] = soft[band]
    alpha[background == 1] = 0

    # I = a*C + (1-a)*255  =>  C = (I - (1-a)*255) / a
    a = np.maximum(alpha, 0.05)[..., None]
    clean = np.clip((bgr.astype(np.float32) - (1 - a) * 255) / a, 0, 255)
    colour = np.where(alpha[..., None] < 1, clean, bgr.astype(np.float32)).astype(np.uint8)

    # A ampliação deixa um fio claro na borda, que aparece no fundo escuro: puxa a cor de
    # dentro para fora e encolhe a máscara um pouco. O filtro de mínimo preserva os bigodes.
    edge = cv2.dilate(background, np.ones((11, 11), np.uint8)).astype(bool)
    darker = cv2.erode(colour, np.ones((7, 7), np.uint8))
    colour[edge] = darker[edge]
    tight = cv2.erode((alpha * 255).astype(np.uint8), np.ones((3, 3), np.uint8))
    tight = cv2.GaussianBlur(tight, (3, 3), 0)
    return colour, tight


def clone_patch(dst, region, source_shift, feather=9):
    """Cobre `region` com o pelo de outra parte do corpo, fundindo as cores nas bordas."""
    mask = cv2.dilate(region, np.ones((feather, feather), np.uint8))
    ys, xs = np.where(mask > 0)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    sx, sy = source_shift[0] * SCALE, source_shift[1] * SCALE
    patch = dst[y0 + sy:y1 + sy, x0 + sx:x1 + sx].copy()
    patch_mask = mask[y0:y1, x0:x1]
    center = ((x0 + x1) // 2, (y0 + y1) // 2)
    return cv2.seamlessClone(patch, dst, patch_mask, center, cv2.NORMAL_CLONE)


def save(name, colour, alpha, manifest, quality=86):
    ys, xs = np.where(alpha > 3)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    rgba = np.dstack([colour[y0:y1, x0:x1], alpha[y0:y1, x0:x1]])
    path = OUT / f'{name}.webp'
    cv2.imwrite(str(path), rgba, [cv2.IMWRITE_WEBP_QUALITY, quality])
    manifest[name] = {
        'x': round(x0 / SCALE + X0, 1),
        'y': round(y0 / SCALE + Y0, 1),
        'width': round((x1 - x0) / SCALE, 1),
        'height': round((y1 - y0) / SCALE, 1),
    }
    print(f'{name:8s} {x1 - x0:4d}x{y1 - y0:<4d} {path.stat().st_size // 1024:4d} KB')


# ── Formas das peças ─────────────────────────────────────────────
ARM_RIGHT = [(223, 276), (229, 280), (228, 289), (250, 292), (263, 310), (265, 337), (253, 351), (233, 351),
             (217, 338), (208, 323), (190, 319), (187, 310), (196, 305), (192, 297), (202, 291), (208, 282),
             (217, 287), (220, 277)]
ARM_LEFT = [(97, 279), (91, 283), (92, 300), (60, 303), (52, 323), (63, 348), (87, 351), (113, 341), (120, 323),
            (136, 316), (136, 307), (127, 299), (119, 284), (110, 284), (103, 282)]

HEAD = [(12, 40), (350, 40), (350, 200), (310, 247), (271, 247), (266, 262), (256, 278), (238, 292), (215, 303),
        (190, 309), (160, 312), (130, 310), (105, 303), (84, 294), (66, 280), (56, 262), (52, 240), (12, 238)]
BODY = [(12, 300), (44, 300), (50, 282), (60, 262), (75, 245), (100, 238), (225, 238), (255, 245), (266, 258),
        (271, 262), (278, 303), (288, 350), (293, 390), (288, 423), (274, 447), (262, 482), (12, 482)]
TAIL = [(262, 250), (350, 250), (350, 482), (262, 482)]
TAIL_HIDDEN = [(250, 262), (278, 262), (296, 350), (296, 425), (270, 455), (250, 440)]

HAIR = [(12, 40), (300, 40), (300, 175), (272, 168), (256, 155), (240, 132), (205, 112), (160, 113), (122, 113),
        (100, 126), (84, 152), (62, 188), (12, 190)]
MOUTH = [(131, 240), (150, 240), (170, 241), (189, 243), (186, 256), (179, 270), (170, 280), (160, 284), (149, 281),
         (140, 270), (134, 256)]
TEETH_AREA = [(137, 238), (184, 240), (181, 252), (174, 262), (146, 262), (140, 252)]
BROW_LEFT = [(106, 141), (115, 129), (127, 123), (145, 124), (145, 131), (127, 132), (115, 137)]
BROW_RIGHT = [(189, 129), (200, 128), (213, 135), (226, 150), (215, 147), (202, 140), (191, 136)]
SUNGLASSES = [(428, 148), (436, 146), (470, 147), (500, 154), (520, 156), (550, 152), (602, 158), (603, 166), (599, 169),
              (594, 186), (586, 202), (566, 207), (546, 204), (534, 194), (522, 170), (514, 166), (508, 170),
              (500, 186), (490, 195), (470, 201), (452, 199), (440, 192), (434, 172), (426, 168)]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    LAYERS_JS.parent.mkdir(parents=True, exist_ok=True)
    source = cv2.imread(str(SOURCE))
    original = upscale(source[Y0:Y1, X0:X1])
    colour, matte = white_matte(original)
    shape = original.shape
    manifest = {}

    # Base limpa: sem braços, para a peça que se mexe não deixar buraco
    arm_right = poly_mask(shape, ARM_RIGHT)
    arm_left = poly_mask(shape, ARM_LEFT)
    holes = cv2.dilate(cv2.bitwise_or(arm_right, arm_left), np.ones((7, 7), np.uint8))
    base = cv2.inpaint(original, holes, 9, cv2.INPAINT_TELEA)

    # Abaixo da barba o peito recebe textura real da barriga, não um borrão
    below_beard = cv2.bitwise_not(poly_mask(shape, HEAD))
    base = clone_patch(base, cv2.bitwise_and(cv2.dilate(arm_right, np.ones((5, 5), np.uint8)), below_beard), (-22, 58))
    base = clone_patch(base, cv2.bitwise_and(cv2.dilate(arm_left, np.ones((5, 5), np.uint8)), below_beard), (38, 58))

    # Dentes: separados do interior da boca
    mouth_mask = poly_mask(shape, MOUTH)
    teeth_area = poly_mask(shape, TEETH_AREA)
    gray = cv2.cvtColor(original, cv2.COLOR_BGR2GRAY)
    teeth = ((gray > 150) & (teeth_area > 0)).astype(np.uint8) * 255
    teeth = cv2.morphologyEx(teeth, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    n, labels, stats, _ = cv2.connectedComponentsWithStats(teeth)
    if n > 1:
        teeth = (labels == 1 + stats[1:, cv2.CC_STAT_AREA].argmax()).astype(np.uint8) * 255
    teeth_soft = cv2.GaussianBlur(teeth, (3, 3), 0)
    mouth_inner = cv2.inpaint(original, cv2.dilate(teeth, np.ones((5, 5), np.uint8)), 7, cv2.INPAINT_TELEA)

    # Cabeça: sem boca e sem sobrancelhas, que viram peças próprias
    brow_left = poly_mask(shape, BROW_LEFT)
    brow_right = poly_mask(shape, BROW_RIGHT)
    head_holes = cv2.bitwise_or(cv2.dilate(mouth_mask, np.ones((5, 5), np.uint8)),
                                cv2.dilate(cv2.bitwise_or(brow_left, brow_right), np.ones((5, 5), np.uint8)))
    head_img = cv2.inpaint(base, head_holes, 11, cv2.INPAINT_TELEA)

    head_alpha = cv2.min(poly_mask(shape, HEAD, 6), matte)
    save('head', np.where(matte[..., None] < 255, colour, head_img), head_alpha, manifest)

    # Corpo: fica por baixo da cabeça, com folga para o movimento dela
    body_alpha = cv2.min(poly_mask(shape, BODY, 2), matte)
    save('body', np.where(matte[..., None] < 255, colour, base), body_alpha, manifest)

    # Cauda: continua por baixo do corpo para não abrir fresta ao balançar
    tail_region = cv2.bitwise_and(poly_mask(shape, TAIL), cv2.bitwise_not(poly_mask(shape, BODY)))
    tail_alpha = cv2.min(tail_region, matte)
    solid = (tail_alpha > 240)
    tail_colour = np.median(original[solid], axis=0).astype(np.uint8)
    hidden = poly_mask(shape, TAIL_HIDDEN, 2)
    tail_img = colour.copy()
    tail_img[(hidden > 0) & (tail_alpha < 200)] = tail_colour
    save('tail', tail_img, cv2.max(tail_alpha, cv2.min(hidden, cv2.max(matte, poly_mask(shape, BODY)))), manifest)

    save('hair', colour, cv2.min(poly_mask(shape, HAIR, 6), matte), manifest)
    save('arm-right', colour, cv2.min(poly_mask(shape, ARM_RIGHT, 2), matte), manifest)
    save('arm-left', colour, cv2.min(poly_mask(shape, ARM_LEFT, 2), matte), manifest)
    save('mouth', mouth_inner, cv2.GaussianBlur(mouth_mask, (5, 5), 0), manifest)
    save('teeth', original, teeth_soft, manifest)
    save('brow-left', original, cv2.GaussianBlur(cv2.dilate(brow_left, np.ones((3, 3), np.uint8)), (5, 5), 0), manifest)
    save('brow-right', original, cv2.GaussianBlur(cv2.dilate(brow_right, np.ones((3, 3), np.uint8)), (5, 5), 0), manifest)

    # Óculos escuros: vêm do castor da direita
    right = upscale(source[Y0:Y1, X0 + SUNGLASSES_DX:X1 + SUNGLASSES_DX])
    shades = [(x - SUNGLASSES_DX, y) for x, y in SUNGLASSES]
    save('shades', right, poly_mask(shape, shades, 1), manifest, quality=90)

    entries = ',\n'.join(
        f"  '{name}': {{ x: {v['x']}, y: {v['y']}, width: {v['width']}, height: {v['height']} }}"
        for name, v in manifest.items()
    )
    LAYERS_JS.write_text(
        '// Gerado por source-assets/mascote/gerar-pecas.py, em pixels da imagem original\n'
        f'export const VIEW_BOX = {{ x: {X0}, y: {Y0}, width: {X1 - X0}, height: {Y1 - Y0} }}\n\n'
        f'export const LAYERS = {{\n{entries},\n}}\n',
        encoding='utf-8',
    )

    # Prévia para conferir a montagem em fundo escuro e claro
    for label, bg in (('dark', (9, 7, 5)), ('light', (243, 246, 244))):
        canvas = np.full((*shape[:2], 3), bg, np.float32)
        for name in ('tail', 'body', 'head', 'mouth', 'teeth', 'brow-left', 'brow-right', 'arm-left', 'arm-right'):
            layer = cv2.imread(str(OUT / f'{name}.webp'), cv2.IMREAD_UNCHANGED).astype(np.float32)
            v = manifest[name]
            x, y = int(round((v['x'] - X0) * SCALE)), int(round((v['y'] - Y0) * SCALE))
            h, w = layer.shape[:2]
            a = layer[..., 3:] / 255
            canvas[y:y + h, x:x + w] = layer[..., :3] * a + canvas[y:y + h, x:x + w] * (1 - a)
        cv2.imwrite(str(ROOT / 'source-assets' / 'mascote' / f'previa-{label}.jpg'), canvas.astype(np.uint8))

    # Prévia da base limpa, sem braços
    cv2.imwrite(str(ROOT / 'source-assets' / 'mascote' / 'previa-sem-bracos.jpg'),
                np.where(head_alpha[..., None] > 128, head_img, np.where(body_alpha[..., None] > 128, base, 255)))


if __name__ == '__main__':
    main()
