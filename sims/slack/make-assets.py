#!/usr/bin/env python3
"""Makes the fake ID and fake proof-of-account pictures used by the Slack referrer sims (sims/slack/assets/).
   Everything is made up: a generic 'Sample' ID card and a 'Sample Bank' statement, with a SAMPLE watermark. Run again to regenerate."""
import os, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets"); os.makedirs(out, exist_ok=True)
F = "/System/Library/Fonts/Supplemental/Arial.ttf"; FB = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
f = lambda s, b=False: ImageFont.truetype(FB if b else F, s)

def watermark(img):
    w, h = img.size; layer = Image.new("RGBA", img.size, (0, 0, 0, 0)); d = ImageDraw.Draw(layer)
    t = Image.new("RGBA", (900, 120), (0, 0, 0, 0)); ImageDraw.Draw(t).text((0, 0), "SAMPLE - FOR TRAINING ONLY", font=f(64, True), fill=(120, 120, 120, 70))
    t = t.rotate(24, expand=True); layer.paste(t, (w // 2 - t.size[0] // 2, h // 2 - t.size[1] // 2), t)
    return Image.alpha_composite(img.convert("RGBA"), layer).convert("RGB")

def portrait(name, skin, hair, shirt, long_hair=True, seed=1):
    """A small illustrated face (training placeholder, not a real person). Saved as assets/photo-<name>.png so it can be swapped for any picture."""
    S = 2; W, H = 300 * S, 340 * S
    im = Image.new("RGB", (W, H), (176, 196, 222)); d = ImageDraw.Draw(im)
    for y in range(H): d.line([0, y, W, y], fill=(176 - y // 40, 196 - y // 50, 222 - y // 60))
    cx = W // 2
    if long_hair: d.rounded_rectangle([cx - 118 * S, 70 * S, cx + 118 * S, 300 * S], 90 * S, fill=hair)       # hair behind
    d.ellipse([cx - 150 * S, 250 * S, cx + 150 * S, 420 * S], fill=shirt)                                    # shoulders
    d.rectangle([cx - 30 * S, 215 * S, cx + 30 * S, 275 * S], fill=tuple(max(0, c - 18) for c in skin))     # neck
    d.ellipse([cx - 80 * S, 70 * S, cx + 80 * S, 245 * S], fill=skin)                                        # face
    d.pieslice([cx - 88 * S, 52 * S, cx + 88 * S, 190 * S], 180, 360, fill=hair)                             # fringe
    d.ellipse([cx - 88 * S, 90 * S, cx - 60 * S, 190 * S], fill=hair); d.ellipse([cx + 60 * S, 90 * S, cx + 88 * S, 190 * S], fill=hair)
    for dx in (-34, 34):                                                                                       # eyes + brows
        d.ellipse([cx + (dx - 13) * S, 142 * S, cx + (dx + 13) * S, 160 * S], fill="white"); d.ellipse([cx + (dx - 7) * S, 144 * S, cx + (dx + 7) * S, 160 * S], fill=(60, 40, 30)); d.ellipse([cx + (dx - 2) * S, 148 * S, cx + (dx + 2) * S, 152 * S], fill="white")
        d.arc([cx + (dx - 17) * S, 124 * S, cx + (dx + 17) * S, 148 * S], 200, 340, fill=hair, width=4 * S)
    d.arc([cx - 9 * S, 160 * S, cx + 9 * S, 196 * S], 20, 160, fill=tuple(max(0, c - 40) for c in skin), width=3 * S)  # nose
    d.arc([cx - 30 * S, 188 * S, cx + 30 * S, 224 * S], 20, 160, fill=(150, 60, 70), width=4 * S)                       # smile
    im = im.resize((300, 340), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.6))
    im.save(os.path.join(out, "photo-%s.png" % name)); return im

PH = {"maria": portrait("maria", (226, 183, 150), (40, 28, 24), (70, 90, 150)),
      "lorna": portrait("lorna", (214, 170, 138), (30, 22, 20), (150, 70, 90), seed=2)}

def id_card(name, dob, addr, idno, show_name=True, who="maria"):
    img = Image.new("RGB", (1011, 638), (232, 240, 250)); d = ImageDraw.Draw(img)
    d.rectangle([0, 0, 1011, 96], fill=(31, 78, 140)); d.text((32, 24), "SAMPLE IDENTIFICATION CARD", font=f(42, True), fill="white"); d.text((760, 36), "Training use only", font=f(22), fill=(200, 215, 235))
    ph = PH[who].resize((290, 330)); img.paste(ph, (40, 140)); d.rectangle([40, 140, 330, 470], outline=(120, 130, 150), width=3)   # photo
    y = 150
    for label, val in [("FULL NAME", name if show_name else ""), ("DATE OF BIRTH", dob), ("ADDRESS", addr), ("ID NUMBER", idno), ("VALID UNTIL", "12/31/2030")]:
        d.text((370, y), label, font=f(20), fill=(90, 100, 120)); 
        if val: d.text((370, y + 26), val, font=f(32 if label == "FULL NAME" else 26, label == "FULL NAME"), fill=(20, 25, 40))
        y += 90
    d.text((40, 585), "SIGNATURE", font=f(16), fill=(90, 100, 120)); d.line([150, 610, 330, 610], fill=(60, 60, 80), width=2)
    return watermark(img)

def proof(name, accno, bank="SAMPLE NATIONAL BANK", show_name=True, show_no=True, show_bank=True):
    img = Image.new("RGB", (1000, 760), "white"); d = ImageDraw.Draw(img)
    d.rectangle([0, 0, 1000, 120], fill=(24, 110, 90))
    if show_bank: d.text((40, 34), bank, font=f(48, True), fill="white")
    d.text((40, 140), "Savings Account - Statement of Account", font=f(30, True), fill=(30, 40, 50))
    rows = [("Account name", name if show_name else ""), ("Account number", accno if show_no else ""), ("Branch", "Sample City Main"), ("Statement period", "01 Oct 2026 - 31 Oct 2026"), ("Currency", "PHP")]
    y = 220
    for k, v in rows:
        d.text((40, y), k, font=f(24), fill=(100, 110, 120)); d.text((360, y), v, font=f(30, True), fill=(20, 25, 35)); d.line([40, y + 48, 960, y + 48], fill=(225, 230, 235), width=2); y += 70
    d.text((40, 600), "Opening balance", font=f(22), fill=(100, 110, 120)); d.text((360, 596), "PHP 12,450.00", font=f(28), fill=(20, 25, 35))
    d.text((40, 650), "Closing balance", font=f(22), fill=(100, 110, 120)); d.text((360, 646), "PHP 18,975.25", font=f(28), fill=(20, 25, 35))
    return watermark(img)

def save(img, name): img.save(os.path.join(out, name), optimize=True)
# demo person (the downloadable samples)
save(id_card("MARIA SANTOS DELA CRUZ", "05/14/1990", "12 Rizal Ave., Quezon City", "SID-2026-004417", who="maria"), "sample-id.png")
save(proof("MARIA SANTOS DELA CRUZ", "0098 7654 3210"), "sample-proof-of-account.png")
# practice person + wrong versions
N = "LORNA MAE VILLAREAL"
save(id_card(N, "09/02/1992", "45 Mabini St., Antipolo City", "SID-2026-008821", who="lorna"), "id-lorna.png")
save(id_card(N, "09/02/1992", "45 Mabini St., Antipolo City", "SID-2026-008821", who="lorna").filter(ImageFilter.GaussianBlur(9)), "id-lorna-blurry.png")
save(id_card(N, "09/02/1992", "45 Mabini St., Antipolo City", "SID-2026-008821", who="lorna").crop((0, 0, 560, 638)), "id-lorna-cropped.png")
save(proof(N, "0123 4567 89"), "proof-lorna.png")
save(proof(N, "0123 4567 89", show_name=False), "proof-lorna-no-name.png")
save(proof(N, "0123 4567 89", show_no=False), "proof-lorna-no-account.png")
print(sorted(os.listdir(out)))
