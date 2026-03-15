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
            sizes="(max-width: 768px) 100vw, 50vw"
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
    <div className="h-full" style={{ backgroundColor: bg }}>
      {/* Pane header bar */}
      <div
        className="py-2 px-4 border-b-2 border-black text-center"
        style={{ backgroundColor: accent }}
      >
        <h2 className="text-sm font-black uppercase tracking-widest text-white">{label}</h2>
      </div>
      {/* Content */}
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

// ─── Drag handle ──────────────────────────────────────────────────────────────

function Handle({ onMouseDown, onTouchStart }: {
  onMouseDown: () => void
  onTouchStart: () => void
}) {
  return (
    <div
      className="relative flex-shrink-0 z-10 cursor-col-resize select-none"
      style={{ width: '6px', background: '#111' }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {/* Floating pill */}
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
  )
}

// ─── Main slider ──────────────────────────────────────────────────────────────

export default function ComparisonSlider({ data }: { data: SiteData }) {
  const [pos, setPos] = useState(50) // percent of container width for left pane
  const dragging = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const clamp = (v: number) => Math.min(Math.max(v, 15), 85)

  const updatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setPos(clamp(((clientX - rect.left) / rect.width) * 100))
  }, [])

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging.current) return
    updatePos(e.clientX)
  }, [updatePos])

  const onMouseUp = useCallback(() => {
    dragging.current = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!dragging.current) return
    updatePos(e.touches[0].clientX)
  }, [updatePos])

  const onTouchEnd = useCallback(() => { dragging.current = false }, [])

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchmove', onTouchMove)
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

  // Fade the receding side as you approach the extremes
  // At center (50): both fully opaque. At limits: receding side hits 0.45
  const leftOpacity = 0.45 + (pos / 100) * 0.55
  const rightOpacity = 0.45 + ((100 - pos) / 100) * 0.55

  return (
    <div ref={containerRef} className="flex overflow-hidden">
      {/* Left pane */}
      <div
        className="overflow-hidden flex-shrink-0"
        style={{ width: `${pos}%`, opacity: leftOpacity, transition: 'opacity 0.08s' }}
      >
        <NewspaperPane content={data.left} side="left" />
      </div>

      {/* Draggable divider */}
      <Handle onMouseDown={startDrag} onTouchStart={startDrag} />

      {/* Right pane — takes remaining space minus handle width */}
      <div
        className="overflow-hidden flex-shrink-0"
        style={{ width: `calc(${100 - pos}% - 6px)`, opacity: rightOpacity, transition: 'opacity 0.08s' }}
      >
        <NewspaperPane content={data.right} side="right" />
      </div>
    </div>
  )
}
