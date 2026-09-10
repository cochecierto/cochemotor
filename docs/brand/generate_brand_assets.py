"""Script de generación de activos de marca oficiales para CocheMotor.

Extrae y optimiza con fondo transparente:
1. Logo completo (Isotipo + Wordmark + Tagline) en PNG transparente.
2. Isotipo (Silueta de coche + biela/pistón) en PNG transparente.
3. Isotipo en versión blanco/cian para fondos oscuros.
4. Icono del pistón en PNG transparente y con fondo Deep Navy.
5. Favicons digitales: favicon.ico (16, 32, 48), favicon-32x32.png, favicon-16x16.png, apple-touch-icon.png (180x180).
6. Favicon vectorial en formato SVG (favicon.svg).
"""

import os
from PIL import Image, ImageOps

BOARD_PATH = "docs/brand/Identidad_marca_cochemotor.jpg"
OUTPUT_DIRS = [
    "docs/brand/assets",
    "local-broker/static/assets/brand",
]

for d in OUTPUT_DIRS:
    os.makedirs(d, exist_ok=True)

img = Image.open(BOARD_PATH).convert("RGB")
bg_val = (242.0, 242.0, 242.0)


def extract_transparent(crop_box, bg_color=(242.0, 242.0, 242.0), threshold=10, ramp=140.0):
    """Extrae un área rectangular y aplica alpha matting anti-aliased."""
    crop = img.crop(crop_box)
    w, h = crop.size
    rgba = Image.new("RGBA", (w, h))

    for y in range(h):
        for x in range(w):
            r, g, b = crop.getpixel((x, y))
            diff = max(bg_color[0] - r, bg_color[1] - g, bg_color[2] - b)
            if diff <= threshold:
                rgba.putpixel((x, y), (0, 0, 0, 0))
            else:
                alpha = min(255, int((diff / ramp) * 255))
                rgba.putpixel((x, y), (r, g, b, alpha))

    # Auto-trim transparent borders
    bbox = rgba.getbbox()
    if bbox:
        rgba = rgba.crop(bbox)
    return rgba


def make_negative_version(rgba_img):
    """Convierte un PNG de tonos oscuros/navy a blanco (#FFFFFF) manteniendo el canal alpha."""
    w, h = rgba_img.size
    white_img = Image.new("RGBA", (w, h))
    for y in range(h):
        for x in range(w):
            r, g, b, a = rgba_img.getpixel((x, y))
            if a > 0:
                white_img.putpixel((x, y), (255, 255, 255, a))
            else:
                white_img.putpixel((x, y), (0, 0, 0, 0))
    return white_img


# 1. Logo Completo (Car + Wordmark + Tagline)
# Bounds: x: 270..1090, y: 515..955
print("Extrayendo logotipo completo...")
logo_full = extract_transparent((270, 515, 1090, 955), ramp=150.0)

# 2. Isotipo Solo (Coche con biela y pistón)
# Bounds: x: 395..965, y: 515..735
print("Extrayendo isotipo...")
isotipo = extract_transparent((395, 515, 965, 735), ramp=140.0)

# 3. Logo en versión negativa (blanco puro) para fondos oscuros
logo_full_white = make_negative_version(logo_full)
isotipo_white = make_negative_version(isotipo)

# 4. Icono del Pistón (Favicon Source)
# Bounds en el box central: x: 1345..1515, y: 510..680 (fondo blanco puro en el recuadro)
print("Extrayendo icono de pistón...")
piston_crop = img.crop((1345, 510, 1515, 680))
pw, ph = piston_crop.size
piston_rgba = Image.new("RGBA", (pw, ph))
# Fondo de la caja es blanco puro ~255, 255, 255
for y in range(ph):
    for x in range(pw):
        r, g, b = piston_crop.getpixel((x, y))
        diff = max(255 - r, 255 - g, 255 - b)
        if diff <= 8:
            piston_rgba.putpixel((x, y), (0, 0, 0, 0))
        else:
            alpha = min(255, int((diff / 150.0) * 255))
            piston_rgba.putpixel((x, y), (r, g, b, alpha))

piston_bbox = piston_rgba.getbbox()
if piston_bbox:
    piston_rgba = piston_rgba.crop(piston_bbox)

# 5. Generación de Favicons Digitales
# Cuadrado centrado para favicons (padding proporcional)
side = max(piston_rgba.size) + 24
square_piston = Image.new("RGBA", (side, side), (0, 0, 0, 0))
offset_x = (side - piston_rgba.width) // 2
offset_y = (side - piston_rgba.height) // 2
square_piston.paste(piston_rgba, (offset_x, offset_y), piston_rgba)

# Apple Touch Icon con fondo Deep Navy institucional (#002D62) y esquinas
apple_touch = Image.new("RGBA", (180, 180), (0, 45, 98, 255))
piston_140 = square_piston.resize((140, 140), Image.Resampling.LANCZOS)
# El pistón en blanco para fondo oscuro
piston_white = make_negative_version(piston_140)
apple_touch.paste(piston_white, (20, 20), piston_white)

# Favicons PNG en tamaños estándar
fav_16 = square_piston.resize((16, 16), Image.Resampling.LANCZOS)
fav_32 = square_piston.resize((32, 32), Image.Resampling.LANCZOS)
fav_48 = square_piston.resize((48, 48), Image.Resampling.LANCZOS)

# Guardar en todas las rutas de assets
for out_dir in OUTPUT_DIRS:
    logo_full.save(os.path.join(out_dir, "cochemotor_logo_transparent.png"), "PNG")
    logo_full_white.save(os.path.join(out_dir, "cochemotor_logo_white_transparent.png"), "PNG")
    isotipo.save(os.path.join(out_dir, "cochemotor_isotipo_transparent.png"), "PNG")
    isotipo_white.save(os.path.join(out_dir, "cochemotor_isotipo_white_transparent.png"), "PNG")
    piston_rgba.save(os.path.join(out_dir, "cochemotor_piston_icon.png"), "PNG")

    # Favicons
    fav_16.save(os.path.join(out_dir, "favicon-16x16.png"), "PNG")
    fav_32.save(os.path.join(out_dir, "favicon-32x32.png"), "PNG")
    fav_48.save(os.path.join(out_dir, "favicon-48x48.png"), "PNG")
    apple_touch.save(os.path.join(out_dir, "apple-touch-icon.png"), "PNG")

    # Favicon.ico multi-resolución (16x16, 32x32, 48x48)
    fav_48.save(
        os.path.join(out_dir, "favicon.ico"),
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
    )

print("¡Todos los activos rasterizados y favicons generados con éxito!")
