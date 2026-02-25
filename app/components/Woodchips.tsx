/**
 * Woodchips.ts — Sistema de virutas de madera realistas con Canvas 2D
 *
 * Mejoras sobre la versión anterior:
 * - Forma irregular: polígonos aleatorios que simulan astillas reales
 * - Dos colores por viruta: cara clara + cara oscura (efecto 3D)
 * - Tumble 3D simulado: la viruta "gira" cambiando su ancho (scaleX oscila)
 * - Ráfagas en pulsos: no todas salen a la vez sino en micro-oleadas
 * - Motion blur: estela corta detrás de cada viruta
 * - Polvo fino separado: partículas circulares muy pequeñas
 * - Aire: las virutas grandes flotan un instante antes de caer
 */

interface Chip {
  x: number; y: number;
  vx: number; vy: number;
  // Tumble 3D
  scaleX: number;       // -1..1, simula rotación en profundidad
  scaleXSpeed: number;  // velocidad de oscilación
  // Rotación 2D
  angle: number;
  angleSpeed: number;
  // Forma: polígono irregular (puntos relativos al centro, radio base)
  radius: number;
  points: Array<{ a: number; r: number }>; // ángulo y radio de cada vértice
  // Visual
  colorFace: string;   // cara iluminada
  colorEdge: string;   // cara en sombra
  alpha: number;
  alphaDec: number;
  // Física
  gravity: number;
  airResist: number;
  // Estela
  trail: Array<{ x: number; y: number; a: number }>;
  // Tipo
  kind: "chip" | "dust";
}

// Paleta madera cálida: cara iluminada / cara sombra
const PALETTE: Array<[string, string]> = [
  ["#e8c98a", "#a07040"],
  ["#d4b070", "#8a5c30"],
  ["#f0d8a0", "#b08050"],
  ["#c8a060", "#7a4820"],
  ["#dcc890", "#9a6838"],
  ["#f5e4b8", "#c09050"],
];

function randPalette() {
  return PALETTE[Math.floor(Math.random() * PALETTE.length)];
}

/** Genera los vértices de una astilla irregular */
function makePoints(n: number, baseRadius: number): Array<{ a: number; r: number }> {
  const pts: Array<{ a: number; r: number }> = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + (Math.random() - 0.5) * (Math.PI / n) * 1.4;
    // Las astillas son alargadas: radio mayor en el eje principal
    const elongation = i % 2 === 0 ? 1.0 : 0.45 + Math.random() * 0.35;
    pts.push({ a, r: baseRadius * elongation * (0.7 + Math.random() * 0.6) });
  }
  return pts;
}

function makeChip(
  x: number, y: number,
  angleDeg: number, spreadDeg: number,
  speed: [number, number],
  size: [number, number],
  gravity: number,
  kind: "chip" | "dust"
): Chip {
  const a = ((angleDeg - spreadDeg / 2 + Math.random() * spreadDeg) * Math.PI) / 180;
  const s = speed[0] + Math.random() * (speed[1] - speed[0]);
  const [colorFace, colorEdge] = randPalette();
  const radius = size[0] + Math.random() * (size[1] - size[0]);
  const nPts = kind === "chip" ? 5 + Math.floor(Math.random() * 4) : 5;

  return {
    x, y,
    vx: Math.cos(a) * s,
    vy: Math.sin(a) * s,
    scaleX: Math.random() * 2 - 1,
    scaleXSpeed: (Math.random() - 0.5) * 0.18,
    angle: Math.random() * Math.PI * 2,
    angleSpeed: (Math.random() - 0.5) * 0.22,
    radius,
    points: makePoints(nPts, radius),
    colorFace,
    colorEdge,
    alpha: 0.9 + Math.random() * 0.1,
    alphaDec: kind === "dust"
      ? 0.008 + Math.random() * 0.012
      : 0.005 + Math.random() * 0.010,
    gravity,
    airResist: kind === "dust" ? 0.985 : 0.975,
    trail: [],
    kind,
  };
}

function drawChip(ctx: CanvasRenderingContext2D, c: Chip) {
  if (c.alpha <= 0) return;

  // Estela (motion blur suave)
  for (let t = 0; t < c.trail.length; t++) {
    const tr = c.trail[t];
    const ta = (t / c.trail.length) * c.alpha * 0.18;
    if (ta <= 0) continue;
    ctx.save();
    ctx.globalAlpha = ta;
    ctx.translate(tr.x, tr.y);
    ctx.rotate(tr.a);
    ctx.scale(Math.abs(c.scaleX) * 0.6, 1);
    ctx.fillStyle = c.colorEdge;
    ctx.beginPath();
    const p0 = c.points[0];
    ctx.moveTo(Math.cos(p0.a) * p0.r * 0.5, Math.sin(p0.a) * p0.r * 0.5);
    for (let i = 1; i < c.points.length; i++) {
      const p = c.points[i];
      ctx.lineTo(Math.cos(p.a) * p.r * 0.5, Math.sin(p.a) * p.r * 0.5);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  ctx.save();
  ctx.globalAlpha = Math.max(0, c.alpha);
  ctx.translate(c.x, c.y);
  ctx.rotate(c.angle);

  if (c.kind === "dust") {
    // Polvo: círculo simple con degradado
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, c.radius);
    grad.addColorStop(0, c.colorFace + "cc");
    grad.addColorStop(1, c.colorEdge + "00");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, c.radius, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Cara en sombra (scaleX < 0 → lado oscuro visible)
    const showDark = c.scaleX < 0;
    ctx.scale(c.scaleX, 1);

    // Sombra suave
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = c.radius * 0.8;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 2;

    ctx.fillStyle = showDark ? c.colorEdge : c.colorFace;
    ctx.beginPath();
    const p0 = c.points[0];
    ctx.moveTo(Math.cos(p0.a) * p0.r, Math.sin(p0.a) * p0.r);
    for (let i = 1; i < c.points.length; i++) {
      const p = c.points[i];
      ctx.lineTo(Math.cos(p.a) * p.r, Math.sin(p.a) * p.r);
    }
    ctx.closePath();
    ctx.fill();

    // Línea de veta de madera sobre la cara iluminada
    if (!showDark) {
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.strokeStyle = c.colorEdge + "55";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-c.radius * 0.6, -c.radius * 0.1);
      ctx.lineTo( c.radius * 0.6,  c.radius * 0.15);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-c.radius * 0.4,  c.radius * 0.2);
      ctx.lineTo( c.radius * 0.5,  c.radius * 0.35);
      ctx.stroke();
    }
  }

  ctx.restore();
}

let canvas: HTMLCanvasElement | null = null;
let ctx2d: CanvasRenderingContext2D | null = null;
let chips: Chip[] = [];
let rafId: number | null = null;

function ensureCanvas() {
  if (canvas) return;
  canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:10000";
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  ctx2d = canvas.getContext("2d");
  window.addEventListener("resize", () => {
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

function tick() {
  if (!ctx2d || !canvas) return;
  ctx2d.clearRect(0, 0, canvas.width, canvas.height);
  chips = chips.filter((c) => c.alpha > 0);

  for (const c of chips) {
    // Guardar posición en estela (máx 4 puntos)
    c.trail.push({ x: c.x, y: c.y, a: c.angle });
    if (c.trail.length > 4) c.trail.shift();

    // Física
    c.vy      += c.gravity * 0.07;
    c.x       += c.vx;
    c.y       += c.vy;
    c.vx      *= c.airResist;
    c.vy      *= c.airResist;
    c.angle   += c.angleSpeed;
    c.scaleX  += c.scaleXSpeed;
    if (c.scaleX >  1) { c.scaleX =  1; c.scaleXSpeed *= -1; }
    if (c.scaleX < -1) { c.scaleX = -1; c.scaleXSpeed *= -1; }
    c.alpha   -= c.alphaDec;

    drawChip(ctx2d, c);
  }

  if (chips.length > 0) rafId = requestAnimationFrame(tick);
  else rafId = null;
}

/**
 * Lanza virutas desde una posición absoluta en pantalla.
 * Las virutas se emiten en micro-pulsos para mayor naturalidad.
 */
export function burst(
  screenX: number,
  screenY: number,
  angleDeg: number,
  spreadDeg: number,
  count: number,
  speed: [number, number] = [3, 7],
  size: [number, number]  = [4, 11],
  gravity = 0.6
) {
  ensureCanvas();

  // Emitir en 3 micro-oleadas con pequeño retraso
  const waves = 3;
  const perWave = Math.ceil(count / waves);

  for (let w = 0; w < waves; w++) {
    setTimeout(() => {
      const n = w === waves - 1 ? count - perWave * (waves - 1) : perWave;
      for (let i = 0; i < n; i++) {
        // Jitter de origen: las virutas no salen exactamente del mismo punto
        const jx = screenX + (Math.random() - 0.5) * 14;
        const jy = screenY + (Math.random() - 0.5) * 14;
        chips.push(makeChip(jx, jy, angleDeg, spreadDeg, speed, size, gravity, "chip"));
      }
      // Polvo fino adicional en cada oleada
      for (let i = 0; i < Math.ceil(n * 0.6); i++) {
        const jx = screenX + (Math.random() - 0.5) * 20;
        const jy = screenY + (Math.random() - 0.5) * 20;
        chips.push(makeChip(jx, jy, angleDeg, spreadDeg * 1.4,
          [speed[0] * 0.2, speed[1] * 0.35], [1.5, 3.5], gravity * 0.2, "dust"));
      }
      if (rafId === null) rafId = requestAnimationFrame(tick);
    }, w * 38); // 38ms entre oleadas
  }
}

export function destroyChips() {
  if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
  chips = [];
  if (canvas) { canvas.remove(); canvas = null; ctx2d = null; }
}