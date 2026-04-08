import { useEffect } from 'react'

export default function ElasticCursor() {
  useEffect(() => {
    if (window.innerWidth < 768) return

    const dot = document.createElement('div')
    dot.id = 'cursor-dot'
    const ring = document.createElement('div')
    ring.id = 'cursor-ring'
    document.body.appendChild(dot)
    document.body.appendChild(ring)

    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0
    let animId

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.left = mouseX + 'px'
      dot.style.top = mouseY + 'px'
    }

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.left = ringX + 'px'
      ring.style.top = ringY + 'px'
      animId = requestAnimationFrame(animate)
    }

    const onEnterLink = () => document.body.classList.add('cursor-hover')
    const onLeaveLink = () => document.body.classList.remove('cursor-hover')

    document.addEventListener('mousemove', onMove)
    animId = requestAnimationFrame(animate)

    const links = document.querySelectorAll('a, button, [role="button"]')
    links.forEach(el => {
      el.addEventListener('mouseenter', onEnterLink)
      el.addEventListener('mouseleave', onLeaveLink)
    })

    // Observe DOM for new interactive elements
    const observer = new MutationObserver(() => {
      document.querySelectorAll('a, button, [role="button"]').forEach(el => {
        el.removeEventListener('mouseenter', onEnterLink)
        el.removeEventListener('mouseleave', onLeaveLink)
        el.addEventListener('mouseenter', onEnterLink)
        el.addEventListener('mouseleave', onLeaveLink)
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(animId)
      observer.disconnect()
      dot.remove()
      ring.remove()
    }
  }, [])

  return null
}
