# QR Code Generator

A simple QR code generator that converts text or URLs into QR codes. You can download the result as a PNG file.

## Features

- Input text or URL
- Generate QR code directly to canvas
- Download result as PNG file
- Keyboard shortcut: **Ctrl/⌘ + Enter** to generate
- Responsive UI, works on mobile too

## Getting Started

Make sure you have Node.js installed on your computer.

```bash
npm install
npm run dev
```

A link will appear in the terminal (usually `http://localhost:5173`), just open it in your browser.

## Build for Production

If you want to deploy to hosting or GitHub Pages:

```bash
npm run build
npm run preview
```

The build output is in the `dist/` folder, ready to upload.

## Project Structure

- `index.html` — main HTML file
- `src/main.js` — logic for generating and downloading QR codes
- `src/style.css` — styling

## Tech Stack

- **Vite** — for dev server and build
- **qrcode** — library for generating QR codes
- Vanilla JavaScript — no framework, pure JS

If you have questions or want to add features, feel free to open an issue or submit a PR.


