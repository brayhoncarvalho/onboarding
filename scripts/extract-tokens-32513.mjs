import { readFileSync } from 'fs'

const raw = readFileSync('figma-node-32513.json', 'utf8')

function toHex(c) {
  const r = Math.round((c.r || 0) * 255).toString(16).padStart(2, '0')
  const g = Math.round((c.g || 0) * 255).toString(16).padStart(2, '0')
  const b = Math.round((c.b || 0) * 255).toString(16).padStart(2, '0')
  return '#' + r + g + b
}

function walk(node, depth = 0, maxDepth = 3) {
  if (depth > maxDepth) return
  const pad = '  '.repeat(depth)
  const bb = node.absoluteBoundingBox || {}
  const fill = node.fills?.[0]?.color ? toHex(node.fills[0].color) : ''
  const stroke = node.strokes?.[0]?.color ? toHex(node.strokes[0].color) : ''
  const cr = node.cornerRadius ? `cr=${node.cornerRadius}` : ''
  const sw = node.strokeWeight && node.strokes?.length ? `sw=${node.strokeWeight}` : ''
  const shadow = node.effects?.find(e => e.type === 'DROP_SHADOW')
  const sh = shadow ? `shadow=0 ${shadow.offset?.y} ${shadow.radius} rgba(0,0,0,${shadow.color?.a?.toFixed(2)})` : ''
  const font = node.style ? `font=${node.style.fontFamily} ${node.style.fontWeight} ${node.style.fontSize}px` : ''
  const chars = node.characters ? ` text="${node.characters.substring(0, 40)}"` : ''
  const visible = node.visible === false ? ' [HIDDEN]' : ''
  
  const info = [
    `${bb.width}x${bb.height}`,
    fill ? `fill=${fill}` : '',
    stroke ? `stroke=${stroke}` : '',
    cr, sw, sh, font
  ].filter(Boolean).join(' ')
  
  console.log(`${pad}${node.name} [${node.type}] ${info}${chars}${visible}`)
  
  if (node.children) {
    node.children.forEach(c => walk(c, depth + 1, maxDepth))
  }
}

const data = JSON.parse(raw)
const root = data.nodes['14165:32513'].document
walk(root, 0, 2)
