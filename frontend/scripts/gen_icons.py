"""Generate CalcHub-branded app assets (icon, adaptive icon, splash, favicon).
Replaces the default Emergent-branded placeholders. Orange calculator theme.
"""
from PIL import Image, ImageDraw

BRAND = (255, 106, 0)          # #FF6A00
BRAND_DARK = (232, 93, 0)      # #E85D00
BRAND_LIGHT = (255, 138, 51)   # #FF8A33
WHITE = (255, 255, 255)
SCREEN = (28, 28, 30)          # #1C1C1E
GRAY = (216, 216, 221)         # #D8D8DD


def rounded(draw, box, r, fill):
    draw.rounded_rectangle(box, radius=r, fill=fill)


def gradient_bg(size, top, bottom):
    """Vertical gradient image, full square."""
    img = Image.new("RGB", (size, size), top)
    d = ImageDraw.Draw(img)
    for y in range(size):
        t = y / size
        r = int(top[0] + (bottom[0] - top[0]) * t)
        g = int(top[1] + (bottom[1] - top[1]) * t)
        b = int(top[2] + (bottom[2] - top[2]) * t)
        d.line([(0, y), (size, y)], fill=(r, g, b))
    return img


def draw_calculator(draw, cx, cy, s, body_fill=WHITE):
    """Draw a calculator centered at (cx, cy). s = overall scale in px (width)."""
    w = s
    h = int(s * 1.42)
    x0 = cx - w / 2
    y0 = cy - h / 2
    x1 = cx + w / 2
    y1 = cy + h / 2
    # body
    rounded(draw, [x0, y0, x1, y1], int(w * 0.17), body_fill)
    pad = w * 0.11
    # screen
    scr_x0 = x0 + pad
    scr_x1 = x1 - pad
    scr_y0 = y0 + pad
    scr_y1 = scr_y0 + h * 0.20
    rounded(draw, [scr_x0, scr_y0, scr_x1, scr_y1], int(w * 0.06), SCREEN)
    # small orange indicator on screen (a "digit" accent)
    ind_w = (scr_x1 - scr_x0) * 0.22
    ind_h = (scr_y1 - scr_y0) * 0.30
    ind_x1 = scr_x1 - (scr_x1 - scr_x0) * 0.10
    ind_y1 = scr_y1 - (scr_y1 - scr_y0) * 0.28
    rounded(draw, [ind_x1 - ind_w, ind_y1 - ind_h, ind_x1, ind_y1], int(ind_h * 0.4), BRAND)
    # buttons 3x3
    grid_top = scr_y1 + h * 0.09
    grid_bottom = y1 - pad
    avail_w = scr_x1 - scr_x0
    avail_h = grid_bottom - grid_top
    br = min(avail_w, avail_h) * 0.135  # button radius
    cols = [scr_x0 + avail_w * f for f in (0.16, 0.5, 0.84)]
    rows = [grid_top + avail_h * f for f in (0.14, 0.5, 0.86)]
    for ri, ry in enumerate(rows):
        for ci, cxp in enumerate(cols):
            fill = GRAY
            # accent the bottom-right (equals) and right column operators
            if ci == 2:
                fill = BRAND_LIGHT if not (ri == 2) else BRAND
            draw.ellipse([cxp - br, ry - br, cxp + br, ry + br], fill=fill)


def make_icon(path, size=1024):
    bg = gradient_bg(size, BRAND_LIGHT, BRAND_DARK)
    d = ImageDraw.Draw(bg)
    draw_calculator(d, size / 2, size / 2, s=size * 0.44)
    bg.save(path)
    print("wrote", path)


def make_adaptive(path, size=1024):
    """Transparent foreground, calculator kept within Android safe zone (~center 66%)."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    draw_calculator(d, size / 2, size / 2, s=size * 0.36)
    img.save(path)
    print("wrote", path)


def make_splash(path, size=768):
    """Rounded orange app-tile with calculator, on transparent bg (splash bg is dark)."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    tile = gradient_bg(size, BRAND_LIGHT, BRAND_DARK).convert("RGBA")
    # rounded mask
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size, size], radius=int(size * 0.22), fill=255)
    img.paste(tile, (0, 0), mask)
    d = ImageDraw.Draw(img)
    draw_calculator(d, size / 2, size / 2, s=size * 0.44)
    img.save(path)
    print("wrote", path)


def make_favicon(path, size=196):
    bg = gradient_bg(size, BRAND_LIGHT, BRAND_DARK).convert("RGBA")
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size, size], radius=int(size * 0.22), fill=255)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(bg, (0, 0), mask)
    d = ImageDraw.Draw(out)
    draw_calculator(d, size / 2, size / 2, s=size * 0.46)
    out.save(path)
    print("wrote", path)


if __name__ == "__main__":
    base = "/app/frontend/assets/images"
    make_icon(f"{base}/icon.png")
    make_adaptive(f"{base}/adaptive-icon.png")
    make_splash(f"{base}/splash-image.png")
    make_splash(f"{base}/app-image.png")
    make_favicon(f"{base}/favicon.png")
    print("done")
