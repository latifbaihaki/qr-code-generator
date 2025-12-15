import './style.css'
import QRCode from 'qrcode'

// get main app element
const app = document.querySelector('#app')

app.innerHTML = `
  <main class="page">
    <header class="hero">
      <h1>QR Code Generator</h1>
      <p>Convert text or URL to QR code and download as PNG.</p>
    </header>

    <section class="card">
      <label class="label" for="input">Enter text or URL</label>
      <textarea id="input" class="textarea" rows="3" placeholder="Example: https://github.com or any text..."></textarea>
      <div class="row">
        <div class="hint" id="hint">Press Ctrl/⌘ + Enter to generate</div>
        <div class="count" id="count">0</div>
      </div>

      <div class="actions">
        <button class="btn primary" id="btn-generate" type="button">Generate</button>
        <button class="btn" id="btn-download" type="button" disabled>Download PNG</button>
        <button class="btn ghost" id="btn-clear" type="button">Reset</button>
    </div>

      <div class="error" id="error" hidden></div>
    </section>

    <section class="result" id="result" hidden>
      <div class="qr-wrap">
        <canvas id="qr"></canvas>
  </div>
    </section>

    <footer class="footer">
      <span>Built with vanilla JS + Vite</span>
    </footer>
  </main>
`

// get all needed elements
const elInput = /** @type {HTMLTextAreaElement} */ (document.querySelector('#input'))
const elCount = document.querySelector('#count')
const elHint = document.querySelector('#hint')
const elError = document.querySelector('#error')
const elResult = document.querySelector('#result')
const elCanvas = /** @type {HTMLCanvasElement} */ (document.querySelector('#qr'))
const btnGenerate = document.querySelector('#btn-generate')
const btnDownload = document.querySelector('#btn-download')
const btnClear = document.querySelector('#btn-clear')

// show error message
function setError(message) {
  if (!message) {
    elError.hidden = true
    elError.textContent = ''
    return
  }
  elError.hidden = false
  elError.textContent = message
}

// toggle loading state on button
function setLoading(isLoading) {
  btnGenerate.disabled = isLoading
  btnGenerate.textContent = isLoading ? 'Generating...' : 'Generate'
}

// sanitize filename for safe download
function sanitizeFilename(text) {
  const base = (text || 'qrcode')
    .trim()
    .slice(0, 24)
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
  return `${base || 'qrcode'}-${Date.now()}.png`
}

// main function to generate QR code
async function renderQR() {
  const value = elInput.value.trim()
  if (!value) {
    setError('Please enter some text or URL first.')
    return
  }
  if (value.length > 1200) {
    setError('Text is too long. Please keep it under 1200 characters.')
    return
  }

  setError('')
  setLoading(true)
  btnDownload.disabled = true

  try {
    // generate QR code to canvas
    await QRCode.toCanvas(elCanvas, value, {
      width: 320,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#0f172a', light: '#ffffff' },
    })
    elResult.hidden = false
    btnDownload.disabled = false
  } catch (e) {
    setError('Failed to generate QR code. Please try again.')
    console.error(e)
  } finally {
    setLoading(false)
  }
}

// download QR code as PNG
function downloadPNG() {
  try {
    const value = elInput.value.trim()
    const name = sanitizeFilename(value)
    // convert canvas to data URL
    const url = elCanvas.toDataURL('image/png')
    // create temporary link to trigger download
    const a = document.createElement('a')
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } catch (e) {
    setError('Failed to download. Please generate again.')
    console.error(e)
  }
}

// reset everything to initial state
function resetAll() {
  elInput.value = ''
  elCount.textContent = '0'
  setError('')
  elResult.hidden = true
  btnDownload.disabled = true
  elInput.focus()
}

// update counter when user types
elInput.addEventListener('input', () => {
  elCount.textContent = String(elInput.value.length)
  if (!elError.hidden) setError('')
})

// keyboard shortcut: Ctrl/Cmd + Enter to generate
elInput.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault()
    renderQR()
  }
})

// event listeners for buttons
btnGenerate.addEventListener('click', renderQR)
btnDownload.addEventListener('click', downloadPNG)
btnClear.addEventListener('click', resetAll)

// change hint text for mobile devices
if (matchMedia('(pointer: coarse)').matches) {
  elHint.textContent = 'Tap Generate to create QR code'
}
