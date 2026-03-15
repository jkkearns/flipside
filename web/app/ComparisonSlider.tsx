'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { SideContent, SiteData, Story } from '@/types/stories'

const SERIF = "Georgia, 'Times New Roman', serif"
const NEWSPRINT = '#fafaf5'

// ─── Hero pane ────────────────────────────────────────────────────────────────
// Full-width. Slider bisects headline and photo at the midpoint.

function HeroPane({ content, side }: { content: SideContent; side: 'left' | 'right' }) {
  const accent = side === 'left' ? '#1a56c4' : '#c41a1a'
  const align: 'left' | 'right' = side === 'left' ? 'left' : 'right'
  const label = side === 'left' ? '◀ THE LEFT' : 'THE RIGHT ▶'

  return (
    <div style={{ backgroundColor: NEWSPRINT, width: '100%' }}>
      {/* Section label */}
      <div style={{ backgroundColor: accent, borderBottom: '2px solid black', padding: '0.35rem 1.25rem' }}>
        <h2 style={{ fontFamily: SERIF, fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'white', textAlign: align }}>
          {label}
        </h2>
      </div>

      {/* Banner headline */}
      <div style={{ padding: '0.5rem 1.25rem 0.4rem', overflow: 'hidden' }}>
        <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', marginBottom: '0.2rem', textAlign: align }}>
          {content.topStory.source}
        </p>
        <a href={content.topStory.url} target="_blank" rel="noopener noreferrer">
          <h2 style={{
            fontFamily: SERIF,
            fontSize: 'clamp(1.5rem, 3vw, 2.4rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            textTransform: 'uppercase',
            color: accent,
            textAlign: align,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}>
            {content.topStory.headline}
          </h2>
        </a>
      </div>

      {/* Full-width photo */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '3/1' }}>
        <Image src={content.topStory.photo} alt={content.topStory.photoAlt} fill className="object-cover" sizes="100vw" />
      </div>
    </div>
  )
}

// ─── Stories row ──────────────────────────────────────────────────────────────
// 4-column newspaper grid. Both panes render at full width.
//
// Left pane:  Story 1 | Story 2 | Story 3 | Story 4   (L→R, left-aligned)
// Right pane: Story 4'| Story 3'| Story 2'| Story 1'  (reversed, right-aligned)
//
// At 50/50 the screen shows:
//   [Story 1 | Story 2 ‖ Story 2' | Story 1']
//                      ↑ divider
// Story 1 (leftmost) mirrors Story 1' (rightmost) — same event, opposite framing.
//
// Slide left  → right pane expands, revealing Story 3' and Story 4' (bonus coverage)
// Slide right → left pane expands, revealing Story 3  and Story 4  (bonus coverage)

function StoryColumn({ story, align, accent }: { story: Story; align: 'left' | 'right'; accent: string }) {
  return (
    <a
      href={story.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: 'block', padding: '0.75rem 1rem', height: '100%' }}
    >
      <p style={{
        fontSize: '0.6rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: accent,
        textAlign: align,
        marginBottom: '0.25rem',
        fontWeight: 700,
      }}>
        {story.source}
      </p>
      <h3 style={{
        fontFamily: SERIF,
        fontSize: 'clamp(1rem, 1.4vw, 1.25rem)',
        fontWeight: 800,
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

function StoriesRow({ content, side }: { content: SideContent; side: 'left' | 'right' }) {
  const accent = side === 'left' ? '#1a56c4' : '#c41a1a'
  const align: 'left' | 'right' = side === 'left' ? 'left' : 'right'

  // Right pane reverses story order so Story 1' sits at the rightmost column,
  // mirroring Story 1 at the leftmost column of the left pane.
  const stories = side === 'right'
    ? [...content.stories.slice(0, 4)].reverse()
    : content.stories.slice(0, 4)

  return (
    <div style={{ backgroundColor: NEWSPRINT, width: '100%', borderTop: '2px solid black' }}>
      {/* Row label */}
      <div style={{ padding: '0.3rem 1.25rem', borderBottom: '1px solid #bbb', backgroundColor: accent + '15' }}>
        <p style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: accent, textAlign: align }}>
          {side === 'left' ? 'More Coverage ▸' : '◂ More Coverage'}
        </p>
      </div>

      {/* 4-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {stories.map((story, i) => (
          <div
            key={i}
            style={{
              borderRight: i < 3 ? '1px solid #ccc' : 'none',
            }}
          >
            <StoryColumn story={story} align={align} accent={accent} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Stacked section ──────────────────────────────────────────────────────────
// Two full-width panes, stacked. Clip-path reveals left portion of left pane
// and right portion of right pane. A hidden spacer sets the container height.

function StackedSection({ left, right, pos, ease }: {
  left: React.ReactNode
  right: React.ReactNode
  pos: number
  ease: string
}) {
  return (
    <div style={{ position: 'relative' }}>
      {/* Both active panes are absolute — they don't contribute to container height */}
      <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - pos}% 0 0)`, transition: ease }}>{left}</div>
      <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 0 0 ${pos}%)`, transition: ease }}>{right}</div>
      {/* Spacer: hidden, in flow — sole source of container height */}
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

  // Hint animation on load
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

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    // Don't hijack clicks on links
    if ((e.target as HTMLElement).closest('a')) return
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    updatePos(clientX)
    dragging.current = true; setIsDragging(true)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const ease = isDragging ? 'none' : 'clip-path 0.45s ease'

  return (
    <div ref={containerRef} style={{ position: 'relative', overflow: 'hidden', userSelect: 'none', cursor: isDragging ? 'col-resize' : 'default' }} onMouseDown={startDrag} onTouchStart={startDrag}>

      {/* Hero: full-width stacked comparison */}
      <StackedSection
        pos={pos} ease={ease}
        left={<HeroPane content={data.left} side="left" />}
        right={<HeroPane content={data.right} side="right" />}
      />

      {/* Stories: 4-column mirrored grid */}
      <StackedSection
        pos={pos} ease={ease}
        left={<StoriesRow content={data.left} side="left" />}
        right={<StoriesRow content={data.right} side="right" />}
      />

      {/* Divider spanning full height */}
      <div
        style={{
          position: 'absolute', top: 0, bottom: 0, zIndex: 20,
          left: `${pos}%`, transform: 'translateX(-50%)',
          width: '5px', background: '#111',
          cursor: 'col-resize',
          transition: isDragging ? 'none' : 'left 0.45s ease',
        }}
      >
        <div style={{
          position: 'absolute', top: '32%',
          left: '50%', transform: 'translate(-50%, -50%)',
          width: '40px', height: '40px',
          background: '#111', color: 'white',
          borderRadius: '50%', border: '2px solid white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '11px', letterSpacing: '0.05em',
          boxShadow: '0 2px 12px rgba(0,0,0,0.6)',
        }}>
          ◀▶
        </div>
      </div>

    </div>
  )
}
