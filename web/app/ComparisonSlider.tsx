'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { SideContent, SiteData, Story } from '@/types/stories'

// ─── Hero pane (full-width stacked comparison) ────────────────────────────────
// Both hero panes render at full container width.
// Left pane clips to show its left portion; right pane clips to show its right portion.
// At 50/50: two different half-photos of the same story, side by side.
// Headlines are single-line and get sliced — enough to read the framing.

function HeroPane({ content, side }: { content: SideContent; side: 'left' | 'right' }) {
  const accent = side === 'left' ? '#1a56c4' : '#c41a1a'
  const bg = side === 'left' ? '#f7f9ff' : '#fff7f7'
  const label = side === 'left' ? '◀ THE LEFT' : 'THE RIGHT ▶'
  return (
    <div style={{ backgroundColor: bg, width: '100%' }}>
      <div className="py-2 px-6 border-b-2 border-black" style={{ backgroundColor: accent }}>
        <h2 className="text-sm font-black uppercase tracking-widest text-white">{label}</h2>
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
            }}
          >
            {content.topStory.headline}
          </h2>
        </a>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">
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

// ─── Stories column (curtain reveal) ─────────────────────────────────────────
// Each column renders at full width internally but lives in a container whose
// width tracks the slider. Headlines are single-line; as the column narrows,
// text is clipped from the right — a curtain sweeping across the list.

function StoryLink({ story, side }: { story: Story; side: 'left' | 'right' }) {
  const accent = side === 'left' ? '#1a56c4' : '#c41a1a'
  return (
    <div className="py-1.5 border-b border-gray-200 overflow-hidden">
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
        }}
      >
        {story.headline}
      </a>
      <span
        className="text-xs uppercase tracking-widest"
        style={{ color: accent, whiteSpace: 'nowrap' }}
      >
        {story.source}
      </span>
    </div>
  )
}

function StoriesColumn({ content, side }: { content: SideContent; side: 'left' | 'right' }) {
  const accent = side === 'left' ? '#1a56c4' : '#c41a1a'
  const bg = side === 'left' ? '#f7f9ff' : '#fff7f7'
  const label = side === 'left' ? 'More from the Left ▸' : '◂ More from the Right'
  return (
    <div style={{ backgroundColor: bg, height: '100%' }}>
      <div className="py-1.5 px-4 border-b border-black" style={{ backgroundColor: accent + '20' }}>
        <h3
          className="text-xs font-black uppercase tracking-widest"
          style={{ color: accent, whiteSpace: 'nowrap' }}
        >
          {label}
        </h3>
      </div>
      <div className="px-4 py-2">
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

  // Hint animation on load: nudge left then settle at center
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

  const ease = isDragging ? 'none' : 'all 0.45s ease'
  const clipEase = isDragging ? 'none' : 'clip-path 0.45s ease'

  return (
    <div ref={containerRef} className="relative overflow-hidden select-none">

      {/* ── HERO: full-width stacked comparison ─────────────────────────── */}
      <div className="relative">

        {/* Left hero — clipped to show its left portion */}
        <div style={{ clipPath: `inset(0 ${100 - pos}% 0 0)`, transition: clipEase }}>
          <HeroPane content={data.left} side="left" />
        </div>

        {/* Right hero — overlaid, clipped to show its right portion */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 0 0 ${pos}%)`, transition: clipEase }}
        >
          <HeroPane content={data.right} side="right" />
        </div>

        {/* Invisible spacer so the section takes the correct height */}
        <div aria-hidden style={{ visibility: 'hidden', pointerEvents: 'none' }}>
          <HeroPane content={data.left} side="left" />
        </div>

      </div>

      {/* ── STORIES: two columns proportional to slider position ─────────── */}
      {/* Headlines are nowrap so they clip at the column edge — curtain effect */}
      <div className="flex border-t-2 border-black">

        <div
          className="flex-shrink-0 overflow-hidden border-r border-gray-400"
          style={{ width: `${pos}%`, transition: ease }}
        >
          <StoriesColumn content={data.left} side="left" />
        </div>

        <div
          className="flex-shrink-0 overflow-hidden"
          style={{ width: `${100 - pos}%`, transition: ease }}
        >
          <StoriesColumn content={data.right} side="right" />
        </div>

      </div>

      {/* ── DIVIDER: single bar spanning both sections ───────────────────── */}
      <div
        className="absolute top-0 bottom-0 z-20 cursor-col-resize"
        style={{
          left: `${pos}%`,
          transform: 'translateX(-50%)',
          width: '5px',
          background: '#111',
          transition: ease,
        }}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
      >
        {/* Drag handle — floats in the hero photo area */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bg-black text-white rounded-full flex items-center justify-center"
          style={{
            top: '38%',
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
