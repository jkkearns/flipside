'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { SideContent, SiteData, Story, TopStory } from '@/types/stories'

const SERIF = "Georgia, 'Times New Roman', serif"
const NEWSPRINT = '#fafaf5'

// ─── Newspaper front page ──────────────────────────────────────────────────────
//
// 4-column broadsheet grid. Lead story (top story + photo) takes 2 columns.
// Left pane: lead on the LEFT, secondary stories fill right columns.
// Right pane: lead on the RIGHT, secondary stories fill left columns (mirrored).
// All text right-aligned on the right pane so headlines "open" from the divider.
//
// Grid layout (left pane):
//   Row 1: [LEAD ×2 cols | Story 1 | Story 2]
//   Row 2: [Story 3 | Story 4 | Story 5 | Story 6]
//   Row 3: [Story 7 ×4 cols]
//
// Right pane mirrors: lead is in cols 3–4, secondary in cols 1–2.

type ColBorder = { borderRight?: string; borderLeft?: string }

function colRule(i: number, totalCols: number): ColBorder {
  return i < totalCols - 1 ? { borderRight: '1px solid #999' } : {}
}

function LeadStory({ story, side, align }: { story: TopStory; side: 'left' | 'right'; align: 'left' | 'right' }) {
  const accent = side === 'left' ? '#1a56c4' : '#c41a1a'
  return (
    <a href={story.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
      <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', marginBottom: '0.4rem', textAlign: align }}>
        {story.source}
      </p>
      <h2 style={{
        fontFamily: SERIF,
        fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)',
        fontWeight: 900,
        lineHeight: 1.1,
        textTransform: 'uppercase',
        color: accent,
        marginBottom: '0.5rem',
        textAlign: align,
      }}>
        {story.headline}
      </h2>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', marginBottom: '0.5rem' }}>
        <Image src={story.photo} alt={story.photoAlt} fill className="object-cover" sizes="50vw" />
      </div>
    </a>
  )
}

function SecondaryStory({ story, size, align }: {
  story: Story
  size: 'large' | 'medium' | 'small'
  align: 'left' | 'right'
}) {
  const fontSize = size === 'large' ? '1.15rem' : size === 'medium' ? '0.95rem' : '0.8rem'
  const weight = size === 'large' ? 800 : 700
  return (
    <a href={story.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
      <p style={{ fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', marginBottom: '0.2rem', textAlign: align }}>
        {story.source}
      </p>
      <h3 style={{
        fontFamily: SERIF,
        fontSize,
        fontWeight: weight,
        lineHeight: 1.25,
        textTransform: 'uppercase',
        color: '#111',
        textAlign: align,
      }}>
        {story.headline}
      </h3>
    </a>
  )
}

function NewspaperPage({ content, side }: { content: SideContent; side: 'left' | 'right' }) {
  const accent = side === 'left' ? '#1a56c4' : '#c41a1a'
  const align: 'left' | 'right' = side === 'left' ? 'left' : 'right'
  const label = side === 'left' ? '◀ THE LEFT' : 'THE RIGHT ▶'

  // Lead occupies cols 1–2 on left pane, cols 3–4 on right pane
  const leadCols = side === 'left' ? '1 / 3' : '3 / 5'
  // Secondary pair in top row: cols 3–4 on left, cols 1–2 on right
  const sec1Col = side === 'left' ? '3 / 4' : '2 / 3'
  const sec2Col = side === 'left' ? '4 / 5' : '1 / 2'

  const cell = (gridColumn: string, borderStyle: ColBorder, rowEnd?: string): React.CSSProperties => ({
    gridColumn,
    ...(rowEnd ? { gridRow: rowEnd } : {}),
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #aaa',
    ...borderStyle,
  })

  return (
    <div style={{ backgroundColor: NEWSPRINT, width: '100%', fontFamily: SERIF }}>

      {/* Section label */}
      <div style={{ backgroundColor: accent, borderBottom: '2px solid black', padding: '0.4rem 1rem' }}>
        <h2 style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'white', textAlign: align }}>
          {label}
        </h2>
      </div>

      {/* Broadsheet grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>

        {/* ── Row 1: lead story (2 cols) + 2 secondary ── */}

        <div style={cell(leadCols, side === 'left' ? { borderRight: '1px solid #999' } : { borderLeft: '1px solid #999' })}>
          <LeadStory story={content.topStory} side={side} align={align} />
        </div>

        <div style={cell(sec1Col, { borderRight: '1px solid #999' })}>
          <SecondaryStory story={content.stories[0]} size="large" align={align} />
        </div>

        <div style={cell(sec2Col, side === 'left' ? {} : { borderRight: '1px solid #999' })}>
          <SecondaryStory story={content.stories[1]} size="large" align={align} />
        </div>

        {/* ── Row 2: four medium stories ── */}

        {content.stories.slice(2, 6).map((story, i) => (
          <div key={i} style={cell(`${i + 1} / ${i + 2}`, colRule(i, 4))}>
            <SecondaryStory story={story} size="medium" align={align} />
          </div>
        ))}

        {/* ── Row 3: last story spans full width ── */}

        <div style={{ ...cell('1 / 5', {}), borderBottom: 'none' }}>
          <SecondaryStory story={content.stories[6]} size="small" align={align} />
        </div>

      </div>
    </div>
  )
}

// ─── Stacked section (shared clip-path mechanic) ──────────────────────────────

function StackedSection({ left, right, pos, ease }: {
  left: React.ReactNode
  right: React.ReactNode
  pos: number
  ease: string
}) {
  return (
    <div className="relative">
      <div style={{ clipPath: `inset(0 ${100 - pos}% 0 0)`, transition: ease }}>{left}</div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)`, transition: ease }}>{right}</div>
      <div aria-hidden style={{ visibility: 'hidden', pointerEvents: 'none' }}>{left}</div>
    </div>
  )
}

// ─── Main slider ──────────────────────────────────────────────────────────────

export default function ComparisonSlider({ data }: { data: SiteData }) {
  const [pos, setPos] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const dragging = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const clamp = (v: number) => Math.min(Math.max(v, 5), 95)

  const updatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setPos(clamp(((clientX - rect.left) / rect.width) * 100))
  }, [])

  const onMouseMove = useCallback((e: MouseEvent) => { if (dragging.current) updatePos(e.clientX) }, [updatePos])
  const onMouseUp = useCallback(() => {
    dragging.current = false; setIsDragging(false)
    document.body.style.cursor = ''; document.body.style.userSelect = ''
  }, [])
  const onTouchMove = useCallback((e: TouchEvent) => { if (dragging.current) updatePos(e.touches[0].clientX) }, [updatePos])
  const onTouchEnd = useCallback(() => { dragging.current = false; setIsDragging(false) }, [])

  useEffect(() => {
    const t1 = setTimeout(() => setPos(35), 700)
    const t2 = setTimeout(() => setPos(50), 1400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd])

  const startDrag = () => {
    dragging.current = true; setIsDragging(true)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const ease = isDragging ? 'none' : 'clip-path 0.45s ease'

  return (
    <div ref={containerRef} className="relative overflow-hidden select-none">

      <StackedSection
        pos={pos} ease={ease}
        left={<NewspaperPage content={data.left} side="left" />}
        right={<NewspaperPage content={data.right} side="right" />}
      />

      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 z-20 cursor-col-resize"
        style={{
          left: `${pos}%`,
          transform: 'translateX(-50%)',
          width: '5px',
          background: '#111',
          transition: isDragging ? 'none' : 'left 0.45s ease',
        }}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2 bg-black text-white rounded-full flex items-center justify-center"
          style={{
            top: '28%',
            width: '40px', height: '40px', fontSize: '11px',
            letterSpacing: '0.05em',
            boxShadow: '0 2px 12px rgba(0,0,0,0.6)',
            border: '2px solid white',
          }}
        >
          ◀▶
        </div>
      </div>

    </div>
  )
}
