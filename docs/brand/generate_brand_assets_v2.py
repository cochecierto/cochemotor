"""Generación refinada de activos oficiales CocheMotor v2.

Correcciones aplicadas:
1. Eliminación total de bordes/halos blancos (unblending matemático puro hacia los colores de marca).
2. Actualización del tagline: eliminado 'Your Digital Automotive Marketplace' y reemplazado por 'Tu Marketplace Digital'.
3. Favicon en color azul sin borde blanco (transparente, sin marcos ni halos).
4. Generación de variantes: con tagline español, sin tagline, en Deep Navy (#002D62), Cyan (#00BFFF) y Blanco (#FFFFFF).
"""

import os
from PIL import Image, ImageDraw, ImageFont

BOARD_PATH = "docs/brand/Identidad_marca_cochemotor.jpg"
OUTPUT_DIRS = [
    "docs/brand/assets",
    "local-broker/static/assets/brand",
]

for d in OUTPUT_DIRS:
    os.makedirs(d, exist_ok=True)

img = Image.open(BOARD_PATH).convert("RGB")
bg_ref = (242.0, 242.0, 242.0)

NAVY = (0, 45, 98)          # #002D62
GRAPHITE = (60, 63, 65)     # #3C3F41
CYAN = (0, 191, 255)        # #00BFFF
WHITE = (255, 255, 255)


def extract_clean_mask(crop_box, threshold=15, ramp=125.0):
    """Extrae un área y calcula una máscara alfa limpia (0..255)."""
    crop = img.crop(crop_box)
    w, h = crop.size
    mask = Image.new("L", (w, h), 0)
    for y in range(h):
        for x in range(w):
            r, g, b = crop.getpixel((x, y))
            diff = max(bg_ref[0] - r, bg_ref[1] - g, bg_ref[2] - b)
            if diff > threshold:
                alpha = min(255, int(((diff - threshold) / ramp) * 255))
                mask.putpixel((x, y), alpha)
    # Trim
    bbox = mask.getbbox()
    if bbox:
        return mask.crop(bbox)
    return mask


def apply_color_to_mask(mask, rgb_color):
    """Aplica un color plano sólido a una máscara alfa.

    CERO contaminación de fondo, CERO halos blancos.
    """
    w, h = mask.size
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    for y in range(h):
        for x in range(w):
            a = mask.getpixel((x, y))
            if a > 0:
                out.putpixel((x, y), (rgb_color[0], rgb_color[1], rgb_color[2], a))
    return out


print("1. Extrayendo componentes vectoriales sin bordes...")
# Isotipo del coche: x: 395..970, y: 520..735
car_mask = extract_clean_mask((395, 520, 970, 735), threshold=12, ramp=115.0)

# Wordmark CocheMotor: x: 275..1085, y: 760..870
word_mask = extract_clean_mask((275, 760, 1085, 870), threshold=12, ramp=115.0)

# Renderizar isotipo y wordmark en Navy, Cyan y Blanco puro (SIN BORDES BLANCOS)
car_navy = apply_color_to_mask(car_mask, NAVY)
car_cyan = apply_color_to_mask(car_mask, CYAN)
car_white = apply_color_to_mask(car_mask, WHITE)

word_navy = apply_color_to_mask(word_mask, NAVY)
word_white = apply_color_to_mask(word_mask, WHITE)

print("2. Renderizando nuevo tagline: 'Marketplace Digital'...")
# Usar tipografía del sistema (Segoe UI / Arial)
font_candidates = [
    "C:/Windows/Fonts/segoeui.ttf",
    "C:/Windows/Fonts/arial.ttf",
]
font_path = None
for f in font_candidates:
    if os.path.exists(f):
        font_path = f
        break

font_size = 42
font = ImageFont.truetype(font_path, font_size) if font_path else ImageFont.load_default()
tagline_text = "Marketplace Digital"

# Medir tagline
dummy = Image.new("RGBA", (1, 1))
d_draw = ImageDraw.Draw(dummy)
t_bbox = d_draw.textbbox((0, 0), tagline_text, font=font)
tw = t_bbox[2] - t_bbox[0]
th = t_bbox[3] - t_bbox[1]

# Tagline en Graphite Charcoal y en Blanco
tagline_navy = Image.new("RGBA", (tw + 10, th + 10), (0, 0, 0, 0))
t_draw = ImageDraw.Draw(tagline_navy)
t_draw.text((5, 2), tagline_text, font=font, fill=(*GRAPHITE, 255))

tagline_white = Image.new("RGBA", (tw + 10, th + 10), (0, 0, 0, 0))
t_draw_w = ImageDraw.Draw(tagline_white)
t_draw_w.text((5, 2), tagline_text, font=font, fill=(*WHITE, 255))

print("3. Componiendo logotipo completo con nuevo tagline...")


def assemble_logo(car_img, word_img, tag_img, include_tagline=True):
    max_w = max(word_img.width, car_img.width)
    spacing_car_word = 25
    spacing_word_tag = 20
    total_h = car_img.height + spacing_car_word + word_img.height
    if include_tagline and tag_img:
        total_h += spacing_word_tag + tag_img.height

    canvas = Image.new("RGBA", (max_w + 40, total_h + 30), (0, 0, 0, 0))

    # Centrar coche
    car_x = (canvas.width - car_img.width) // 2
    canvas.paste(car_img, (car_x, 15), car_img)

    # Centrar wordmark
    word_y = 15 + car_img.height + spacing_car_word
    word_x = (canvas.width - word_img.width) // 2
    canvas.paste(word_img, (word_x, word_y), word_img)

    # Centrar tagline
    if include_tagline and tag_img:
        tag_y = word_y + word_img.height + spacing_word_tag
        tag_x = (canvas.width - tag_img.width) // 2
        canvas.paste(tag_img, (tag_x, tag_y), tag_img)

    # Trim final
    final_bbox = canvas.getbbox()
    return canvas.crop(final_bbox)


logo_navy_tagline = assemble_logo(car_navy, word_navy, tagline_navy, True)
logo_navy_clean = assemble_logo(car_navy, word_navy, None, False)

logo_white_tagline = assemble_logo(car_white, word_white, tagline_white, True)
logo_white_clean = assemble_logo(car_white, word_white, None, False)

print("4. Generando Favicon en azul SIN BORDE BLANCO...")
# Extraer el pistón del recuadro central (x: 1355..1505, y: 520..670)
piston_crop = img.crop((1355, 520, 1505, 670))
pw, ph = piston_crop.size
piston_mask = Image.new("L", (pw, ph), 0)
# Fondo de la caja es ~255
for y in range(ph):
    for x in range(pw):
        r, g, b = piston_crop.getpixel((x, y))
        diff = max(255 - r, 255 - g, 255 - b)
        if diff > 10:
            alpha = min(255, int(((diff - 10) / 120.0) * 255))
            piston_mask.putpixel((x, y), alpha)

p_bbox = piston_mask.getbbox()
piston_mask = piston_mask.crop(p_bbox)

# Pistón en Azul Marino puro (Deep Navy) - CERO BORDE BLANCO
piston_navy = apply_color_to_mask(piston_mask, NAVY)
# Pistón en Cyan Electric Blue - CERO BORDE BLANCO
piston_cyan = apply_color_to_mask(piston_mask, CYAN)

# Generar favicons en formato cuadrado transparente (icono azul sobre fondo 100% transparente)
side = max(piston_navy.size) + 16
fav_canvas_navy = Image.new("RGBA", (side, side), (0, 0, 0, 0))
fav_canvas_navy.paste(
    piston_navy,
    ((side - piston_navy.width) // 2, (side - piston_navy.height) // 2),
    piston_navy,
)

fav_canvas_cyan = Image.new("RGBA", (side, side), (0, 0, 0, 0))
fav_canvas_cyan.paste(
    piston_cyan,
    ((side - piston_cyan.width) // 2, (side - piston_cyan.height) // 2),
    piston_cyan,
)

# Favicons PNG en azul marino puro (sin bordes blancos de ningún tipo)
fav_navy_16 = fav_canvas_navy.resize((16, 16), Image.Resampling.LANCZOS)
fav_navy_32 = fav_canvas_navy.resize((32, 32), Image.Resampling.LANCZOS)
fav_navy_48 = fav_canvas_navy.resize((48, 48), Image.Resampling.LANCZOS)

fav_cyan_32 = fav_canvas_cyan.resize((32, 32), Image.Resampling.LANCZOS)

# Apple Touch Icon: fondo Deep Navy sólido (#002D62) con isotipo en Cyan (#00BFFF) SIN BORDES BLANCOS
apple_touch_solid = Image.new("RGBA", (180, 180), (*NAVY, 255))
piston_cyan_130 = fav_canvas_cyan.resize((130, 130), Image.Resampling.LANCZOS)
apple_touch_solid.paste(piston_cyan_130, (25, 25), piston_cyan_130)

print("5. Guardando activos en directorios de destino...")
for out_dir in OUTPUT_DIRS:
    # 1. Logos Oficiales sin borde blanco
    logo_navy_tagline.save(os.path.join(out_dir, "cochemotor_logo_azul_con_tagline.png"), "PNG")
    logo_navy_clean.save(os.path.join(out_dir, "cochemotor_logo_azul_sin_tagline.png"), "PNG")
    logo_navy_tagline.save(os.path.join(out_dir, "cochemotor_logo_transparent.png"), "PNG")

    # Logos blancos para fondos oscuros
    logo_white_tagline.save(os.path.join(out_dir, "cochemotor_logo_white_transparent.png"), "PNG")
    logo_white_clean.save(os.path.join(out_dir, "cochemotor_logo_blanco_sin_tagline.png"), "PNG")

    # Isotipos puros sin bordes
    car_navy.save(os.path.join(out_dir, "cochemotor_isotipo_azul.png"), "PNG")
    car_cyan.save(os.path.join(out_dir, "cochemotor_isotipo_cyan.png"), "PNG")
    car_white.save(os.path.join(out_dir, "cochemotor_isotipo_white.png"), "PNG")

    # Icono del pistón azul transparente
    piston_navy.save(os.path.join(out_dir, "cochemotor_piston_azul_transparente.png"), "PNG")
    piston_cyan.save(os.path.join(out_dir, "cochemotor_piston_cyan_transparente.png"), "PNG")

    # Favicons (Azul sobre fondo transparente - SIN BORDE BLANCO)
    fav_navy_16.save(os.path.join(out_dir, "favicon-16x16.png"), "PNG")
    fav_navy_32.save(os.path.join(out_dir, "favicon-32x32.png"), "PNG")
    fav_navy_48.save(os.path.join(out_dir, "favicon-48x48.png"), "PNG")
    fav_cyan_32.save(os.path.join(out_dir, "favicon-cyan-32x32.png"), "PNG")

    # Favicon.ico multi-resolución en azul puro sobre transparente
    fav_navy_48.save(
        os.path.join(out_dir, "favicon.ico"),
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
    )

    # Apple Touch Icon sin ningún borde blanco
    apple_touch_solid.save(os.path.join(out_dir, "apple-touch-icon.png"), "PNG")

# Generar favicon.svg en azul puro sobre fondo transparente SIN BORDE BLANCO
svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <!-- Favicon CocheMotor en Azul Oficial (#002D62 y #00BFFF) SIN BORDES BLANCOS -->
  <g transform="translate(32, 32) rotate(45) translate(-32, -32)">
    <!-- Corona del pistón en Cyan Electric Blue -->
    <rect x="22" y="10" width="20" height="14" rx="2" fill="#00BFFF"/>
    <!-- Ranuras de compresión en Deep Navy -->
    <line x1="22" y1="14" x2="42" y2="14" stroke="#002D62" stroke-width="1.5"/>
    <line x1="22" y1="18" x2="42" y2="18" stroke="#002D62" stroke-width="1.5"/>
    
    <!-- Bulón en Deep Navy -->
    <circle cx="32" cy="20" r="2.5" fill="#002D62"/>
    
    <!-- Biela en Deep Navy sin bordes blancos -->
    <path d="M30 24 L29 44 L35 44 L34 24 Z" fill="#002D62"/>
    
    <!-- Pie de biela / Ojo del cigüeñal en Deep Navy -->
    <circle cx="32" cy="48" r="8" fill="#002D62"/>
    <circle cx="32" cy="48" r="4.5" fill="#00BFFF"/>
  </g>
</svg>
"""

for out_dir in OUTPUT_DIRS:
    with open(os.path.join(out_dir, "favicon.svg"), "w", encoding="utf-8") as f:
        f.write(svg_content)

print("¡Todos los activos refinados (sin bordes blancos y con tagline español) generados con éxito!")
