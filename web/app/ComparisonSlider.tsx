'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { SideContent, SiteData, Story } from '@/types/stories'

// ─── Hero pane ────────────────────────────────────────────────────────────────
// Full-width. Both sides stack; clip-path bisects them at the divider.
// At 50/50: two different half-photos of the same story meeting at center.

function HeroPane({ content, side }: { content: SideContent; side: 'left' | 'right' }) {
  const accent = side === 'left' ? '#1a56c4' : '#c41a1a'
  const bg = side === 'left' ? '#f7f9ff' : '#fff7f7'
  const label = side === 'left' ? '◀ THE LEFT' : 'THE RIGHT ▶'
  const align = side === 'left' ? 'left' : 'right'

  return (
    <div style={{ backgroundColor: bg, width: '100%' }}>
      <div className="py-2 px-6 border-b-2 border-black" style={{ backgroundColor: accent }}>
        <h2
          className="text-sm font-black uppercase tracking-widest text-white"
          style={{ textAlign: align }}
        >
          {label}
        </h2>
      </div>
      <div className="px-6 pt-4 pb-2 overflow-hidden">
        <a href={content.topStory.url} target="_blank" rel="noopener noreferrer">
          <h2
            className="font-black uppercase leading-tight hover:underline"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
              color: accent,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textAlign: align,
            }}
          >
            {content.topStory.headline}
          </h2>
        </a>
        <p
          className="text-xs text-gray-500 mt-1 uppercase tracking-widest"
          style={{ textAlign: align }}
        >
          {content.topStory.source}
        </p>
      </div>
      <div className="relative w-full" style={{ aspectRatio: '3/2' }}>
        <Image
          src={content.topStory.photo}
          alt={content.topStory.photoAlt}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
    </div>
  )
}

// ─── Stories pane ─────────────────────────────────────────────────────────────
// Full-width. Both sides stack with the same clip-path mechanic as the hero.
// Left side: LTR, headlines left-aligned — text grows rightward from left edge.
// Right side: headlines right-aligned — text grows leftward from right edge.
// Both sides show the beginning of their headlines at the divider edge.
// No reflow, ever — only the clip boundary moves.

function StoryRow({ story, side }: { story: Story; side: 'left' | 'right' }) {
  const accent = side === 'left' ? '#1a56c4' : '#c41a1a'
  const align = side === 'left' ? 'left' : 'right'
  return (
    <div className="py-2 border-b border-gray-200 px-6 overflow-hidden">
      <a
        href={story.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-sm font-bold uppercase leading-snug hover:underline"
        style={{
          color: '#111',
          fontFamily: "Georgia, 'Times New Roman', serif",
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textAlign: align,
        }}
      >
        {story.headline}
      </a>
      <p
        className="text-xs uppercase tracking-widest mt-0.5"
        style={{ color: accent, whiteSpace: 'nowrap', textAlign: align }}
      >
        {story.source}
      </p>
    </div>
  )
}

function StoriesPane({ content, side }: { content: SideContent; side: 'left' | 'right' }) {
  const accent = side === 'left' ? '#1a56c4' : '#c41a1a'
  const bg = side === 'left' ? '#f0f3ff' : '#fff0f0'
  const label = side === 'left' ? '◀ More from the Left' : 'More from the Right ▶'
  const align = side === 'left' ? 'left' : 'right'
  return (
    <div style={{ backgroundColor: bg, width: '100%' }}>
      <div
        className="py-1.5 px-6 border-b border-black"
        style={{ backgroundColor: accent + '18' }}
      >
        <h3
          className="text-xs font-black uppercase tracking-widest"
          style={{ color: accent, whiteSpace: 'nowrap', textAlign: align }}
        >
          {label}
        </h3>
      </div>
      {content.stories.map((story, i) => (
        <StoryRow key={i} story={story} side={side} />
      ))}
    </div>
  )
}

// ─── Reusable stacked section ─────────────────────────────────────────────────
// Renders two full-width panes stacked. Left clips to show its left portion;
// right clips to show its right portion. A hidden spacer sets the height.

function StackedSection({
  left,
  right,
  pos,
  ease,
}: {
  left: React.ReactNode
  right: React.ReactNode
  pos: number
  ease: string
}) {
  return (
    <div className="relative">
      {/* Left pane — in flow (sets height), clipped to left portion */}
      <div style={{ clipPath: `inset(0 ${100 - pos}% 0 0)`, transition: ease }}>
        {left}
      </div>
      {/* Right pane — absolute overlay, clipped to right portion */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)`, transition: ease }}>
        {right}
      </div>
      {/* Spacer — invisible, sets container height */}
      <div aria-hidden style={{ visibility: 'hidden', pointerEvents: 'none' }}>
        {left}
      </div>
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

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (dragging.current) updatePos(e.clientX)
  }, [updatePos])

  const onMouseUp = useCallback(() => {
    dragging.current = false
    setIsDragging(false)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (dragging.current) updatePos(e.touches[0].clientX)
  }, [updatePos])

  const onTouchEnd = useCallback(() => {
    dragging.current = false
    setIsDragging(false)
  }, [])

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

  const startDrag = () => {
    dragging.current = true
    setIsDragging(true)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const ease = isDragging ? 'none' : 'clip-path 0.45s ease'

  return (
    <div ref={containerRef} className="relative overflow-hidden select-none">

      {/* Hero section */}
      <StackedSection
        pos={pos}
        ease={ease}
        left={<HeroPane content={data.left} side="left" />}
        right={<HeroPane content={data.right} side="right" />}
      />

      {/* Stories section */}
      <div className="border-t-2 border-black">
        <StackedSection
          pos={pos}
          ease={ease}
          left={<StoriesPane content={data.left} side="left" />}
          right={<StoriesPane content={data.right} side="right" />}
        />
      </div>

      {/* Divider — spans full height of both sections */}
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
        {/* Handle — floats in the photo area */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bg-black text-white rounded-full flex items-center justify-center"
          style={{
            top: '35%',
            width: '40px',
            height: '40px',
            fontSize: '11px',
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
