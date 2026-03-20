# Das ultimative Vite & NPM Handbuch (Portfolio)

Dieses Projekt nutzt **Vite**. Vite ist nicht nur für Schriften da, sondern optimiert dein gesamtes Projekt (Bilder, JS, CSS) für den Server.

---

## 1. Das Herzstück: Der `public`-Ordner
Alles, was Vite **nicht** anfasst, verkleinert oder verändert soll, muss in einen Ordner namens `public`. Alles darin wird beim `npm run build` einfach **1:1** in den `dist`-Ordner kopiert.

**Was gehört in `public`?**
- `mail.php` (PHP wird von Vite nicht verarbeitet)
- `robots.txt`
- `projects.json` & `translations.json` (wenn sie per `fetch` geladen werden)
- Ganze HTML-Unterordner wie `impressum/` oder `datenschutz/`, wenn sie einfaches HTML sind.
- Bilder (`img/`, `svg/`), auf die du dich dynamisch in JS beziehst.

**Pfade in HTML:**
In deiner `index.html` schreibst du dann statt `./img/logo.png` einfach `/img/logo.png`. Vite weiß, dass `/` den `public`-Ordner (oder den Root nach dem Build) meint.

---

## 2. NPM Pakete nutzen (Schriften & Bibliotheken)

### Schriften (z.B. Fontsource)
1. Installieren: `npm install @fontsource/name-der-schrift`
2. Importieren in `variables.css`: `@import "@fontsource/name-der-schrift/index.css";`
3. Nutzen: `font-family: 'Name der Schrift', sans-serif;`

### JS-Bibliotheken (z.B. Confetti, Swiper, GSAP)
1. Installieren: `npm install canvas-confetti`
2. Nutzen in `js/script.js`:
   ```javascript
   import confetti from 'canvas-confetti';
   confetti();
   ```
*Hinweis: Damit `import` im JS funktioniert, muss dein `<script src="...">` in der HTML den Typ `type="module"` haben.*

---

## 3. Die wichtigsten Befehle

| Befehl | Was passiert? | Wann nutzen? |
| :--- | :--- | :--- |
| `npm install` | Installiert alles aus der `package.json`. | Nach dem Download oder wenn du neue Pakete hinzufügst. |
| `npm run dev` | Startet den extrem schnellen Live-Server. | **Immer beim Programmieren.** |
| `npm run build` | Erstellt den fertigen `dist`-Ordner. | **Bevor du die Website hochlädst.** |
| `npm run preview` | Zeigt dir lokal genau das an, was im `dist`-Ordner ist. | Zum Testen vor dem Hochladen. |

---

## 4. Deployment (Wie kommt es auf den Server?)

1. Führe `npm run build` aus.
2. Schau in den Ordner **`dist`**. Du wirst sehen:
   - Deine `index.html` ist dort.
   - Ein Ordner `assets/` enthält dein CSS, JS und die Fonts (mit kryptischen Namen für das Browser-Caching).
   - Alle Dateien aus `public` liegen direkt im Root von `dist`.
3. **Lade nur den Inhalt von `dist` auf deinen FTP-Server hoch.**

---

## 5. Tipps für Profis
- **Bilder optimieren:** Wenn du Bilder direkt im HTML per `<img src="./img/..." />` einbindest, optimiert Vite diese automatisch.
- **Fehlermeldungen:** Wenn `npm run dev` abbricht, lösche den Ordner `node_modules` und tippe erneut `npm install`.
