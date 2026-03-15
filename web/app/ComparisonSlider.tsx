'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { SideContent, SiteData, Story, TopStory } from '@/types/stories'

// ─── Sub-components ───────────────────────────────────────────────────────────

function TopStoryBlock({ story, side }: { story: TopStory; side: 'left' | 'right' }) {
  const accent = side === 'left' ? '#1a56c4' : '#c41a1a'
  return (
    <div className="mb-4">
      <a href={story.url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="relative w-full overflow-hidden mb-2" style={{ aspectRatio: '16/9' }}>
          <Image
            src={story.photo}
            alt={story.photoAlt}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <h2
          className="text-xl font-black leading-tight uppercase hover:underline"
          style={{ color: accent, fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: '0.02em' }}
        >
          {story.headline}
        </h2>
      </a>
      <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{story.source}</p>
    </div>
  )
}

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

function NewspaperPane({ content, side }: { content: SideContent; side: 'left' | 'right' }) {
  const accent = side === 'left' ? '#1a56c4' : '#c41a1a'
  const bg = side === 'left' ? '#f7f9ff' : '#fff7f7'
  const label = side === 'left' ? '◀ THE LEFT' : 'THE RIGHT ▶'
  return (
    <div style={{ backgroundColor: bg, width: '100%' }}>
      <div className="py-2 px-4 border-b-2 border-black text-center" style={{ backgroundColor: accent }}>
        <h2 className="text-sm font-black uppercase tracking-widest text-white">{label}</h2>
      </div>
      <div className="px-4 py-4">
        <TopStoryBlock story={content.topStory} side={side} />
        <div>
          {content.stories.map((story, i) => (
            <StoryLink key={i} story={story} side={side} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main slider ──────────────────────────────────────────────────────────────

export default function ComparisonSlider({ data }: { data: SiteData }) {
  const [pos, setPos] = useState(50) // percent: where the clip boundary sits
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

      {/* LEFT pane — full width, sits in normal flow (sets container height) */}
      <div style={{ width: '100%' }}>
        <NewspaperPane content={data.left} side="left" />
      </div>

      {/* RIGHT pane — full width, absolutely overlaid, clipped from the left edge to `pos` */}
      {/* clip-path: inset(top right bottom left) — cuts off `pos%` from the left, revealing left pane beneath */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
      >
        <NewspaperPane content={data.right} side="right" />
      </div>

      {/* Divider line + drag handle */}
      <div
        className="absolute top-0 bottom-0 z-20 cursor-col-resize"
        style={{
          left: `${pos}%`,
          transform: 'translateX(-50%)',
          width: '6px',
          background: '#111',
        }}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
      >
        {/* Pill handle */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white rounded-full flex items-center justify-center"
          style={{
            width: '40px',
            height: '40px',
            fontSize: '11px',
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
