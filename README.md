# Daniel Moor-Young — Portfolio

Cyberpunk / Japanese Game UI personal portfolio for a Motion Designer.

## How to Run Locally

**Option A — Python (no install needed)**
```bash
cd portfolio
python3 -m http.server 3456
# Open: http://localhost:3456
```

**Option B — Node (npx serve)**
```bash
npx serve portfolio -p 3456
# Open: http://localhost:3456
```

**Option C — VS Code Live Server**  
Open `portfolio/index.html` → right-click → "Open with Live Server"

---

## Adding Your Images

Place these files in `assets/images/`:

| File | Description |
|------|-------------|
| `character.png` | Anime character portrait (lime bg, transparent or cropped) |
| `mascot-white.png` | Cat mascot logo on transparent bg |

The site shows placeholders if images are missing — just drop them in when ready.

---

## Replacing the QR Code

The QR in the Contact section is a placeholder SVG.  
To replace it, add your real QR image at `assets/images/qr-telegram.png` and update the `<div class="qr-code">` in `index.html`:

```html
<div class="qr-code">
  <img src="assets/images/qr-telegram.png" alt="QR code for Telegram" width="124" height="124" />
</div>
```

---

## Customizing Colors

All colors are CSS variables in `style.css` at the top:

```css
--lime:   #C8FF00   /* neon green accent */
--black:  #080808   /* background */
--white:  #F5F0E8   /* warm white text */
```

## Project Structure

```
portfolio/
├── index.html       ← Main page
├── style.css        ← All styles + CSS variables
├── script.js        ← Interactions, animations
└── assets/
    └── images/
        ├── character.png      ← Anime portrait (add yours)
        └── mascot-white.png   ← Cat mascot (add yours)
```
