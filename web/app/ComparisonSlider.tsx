'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { SideContent, SiteData, Story } from '@/types/stories'

// ─── Sub-components ───────────────────────────────────────────────────────────

function StoryLink({ story, side }: { story: Story; side: 'left' | 'right' }) {
  const accent = side === 'left' ? '#1a56c4' : '#c41a1a'
  return (
    <div className="py-1.5 border-b border-gray-200">
      <a
        href={story.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-sm font-bold uppercase leading-snug hover:underline"
        style={{ color: '#111', fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        {story.headline}
      </a>
      <span className="text-xs uppercase tracking-widest" style={{ color: accent }}>
        {story.source}
      </span>
    </div>
  )
}

// Each pane renders at full container width.
// The LEFT pane is RTL (content anchored to the right edge, grows leftward).
// The RIGHT pane is LTR (content anchored to the left edge, grows rightward).
//
// At 50/50, with left pane clipped to show its right 50% and right pane clipped
// to show its left 50%, you see:
//   - LEFT pane's right edge: beginning of left headline + right half of left photo
//   - RIGHT pane's left edge: beginning of right headline + left half of right photo
//
// Two different photos of the same story, bisected. Half a headline on each side.
// Drag to reveal the full framing.

function NewspaperPane({ content, side }: { content: SideContent; side: 'left' | 'right' }) {
  const accent = side === 'left' ? '#1a56c4' : '#c41a1a'
  const bg = side === 'left' ? '#f7f9ff' : '#fff7f7'
  const label = side === 'left' ? '◀ THE LEFT' : 'THE RIGHT ▶'

  // Left pane: RTL so content is anchored to the right edge (the divider)
  // Right pane: LTR so content is anchored to the left edge (the divider)
  // Both panes "open outward" from center as you drag.
  const dir = side === 'left' ? 'rtl' : 'ltr'

  return (
    <div style={{ backgroundColor: bg, width: '100%', direction: dir }}>
      {/* Header bar */}
      <div
        className="py-2 border-b-2 border-black"
        style={{ backgroundColor: accent, paddingLeft: '1.5rem', paddingRight: '1.5rem' }}
      >
        <h2
          className="text-sm font-black uppercase tracking-widest text-white"
          style={{ direction: 'ltr', textAlign: side === 'left' ? 'right' : 'left' }}
        >
          {label}
        </h2>
      </div>

      {/* Banner headline — single line, cut by slider */}
      <div style={{ padding: '1rem 1.5rem 0.5rem', overflow: 'hidden' }}>
        <a href={content.topStory.url} target="_blank" rel="noopener noreferrer">
          <h2
            className="font-black uppercase leading-none hover:underline"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
              color: accent,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              direction: 'ltr',
              textAlign: side === 'left' ? 'right' : 'left',
            }}
          >
            {content.topStory.headline}
          </h2>
        </a>
        <p
          className="text-xs text-gray-500 mt-1 uppercase tracking-widest"
          style={{ direction: 'ltr', textAlign: side === 'left' ? 'right' : 'left' }}
        >
          {content.topStory.source}
        </p>
      </div>

      {/* Full-width photo — the main visual that gets bisected */}
      <div className="relative w-full" style={{ aspectRatio: '3/2' }}>
        <Image
          src={content.topStory.photo}
          alt={content.topStory.photoAlt}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Supporting headlines */}
      <div style={{ padding: '1rem 1.5rem', direction: 'ltr' }}>
        {content.stories.map((story, i) => (
          <StoryLink key={i} story={story} side={side} />
        ))}
      </div>
    </div>
  )
}

// ─── Main slider ──────────────────────────────────────────────────────────────

export default function ComparisonSlider({ data }: { data: SiteData }) {
  const [pos, setPos] = useState(50)
  const dragging = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const clamp = (v: number) => Math.min(Math.max(v, 5), 95)

  const updatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setPos(clamp(((clientX - rect.left) / rect.width) * 100))
  }, [])

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (dragging.current) updatePos(e.clientX)
  }, [updatePos])

  const onMouseUp = useCallback(() => {
    dragging.current = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (dragging.current) updatePos(e.touches[0].clientX)
  }, [updatePos])

  const onTouchEnd = useCallback(() => { dragging.current = false }, [])

  // Hint animation on mount: nudge the slider left then back to center
  useEffect(() => {
    const t1 = setTimeout(() => setPos(35), 600)
    const t2 = setTimeout(() => setPos(50), 1200)
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
    dragging.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  return (
    <div ref={containerRef} className="relative overflow-hidden select-none">

      {/* LEFT pane — clipped to show only its RIGHT portion (up to the slider) */}
      {/* RTL layout means content is anchored to the right edge = the divider */}
      <div
        style={{
          width: '100%',
          clipPath: `inset(0 ${100 - pos}% 0 0)`,
          transition: dragging.current ? 'none' : 'clip-path 0.4s ease',
        }}
      >
        <NewspaperPane content={data.left} side="left" />
      </div>

      {/* RIGHT pane — absolutely overlaid, clipped to show only its LEFT portion (from slider rightward) */}
      {/* LTR layout means content is anchored to the left edge = the divider */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 0 0 ${pos}%)`,
          transition: dragging.current ? 'none' : 'clip-path 0.4s ease',
        }}
      >
        <NewspaperPane content={data.right} side="right" />
      </div>

      {/* Invisible spacer so the container gets the right height */}
      <div aria-hidden style={{ visibility: 'hidden', pointerEvents: 'none' }}>
        <NewspaperPane content={data.left} side="left" />
      </div>

      {/* Divider handle */}
      <div
        className="absolute top-0 bottom-0 z-20 cursor-col-resize"
        style={{
          left: `${pos}%`,
          transform: 'translateX(-50%)',
          width: '6px',
          background: '#111',
          transition: dragging.current ? 'none' : 'left 0.4s ease',
        }}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white rounded-full flex items-center justify-center"
          style={{
            width: '40px', height: '40px', fontSize: '11px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
            border: '2px solid white',
            letterSpacing: '0.05em',
          }}
        >
          ◀▶
        </div>
      </div>

    </div>
  )
}
