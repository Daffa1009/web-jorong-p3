'use client'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

export default function ScrollReveal({ 
  children, 
  direction = 'up',  // 'up' | 'down' | 'left' | 'right'
  delay = 0,
  className = ''
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const shouldReduceMotion = useReducedMotion()
  
  const variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : (direction === 'up' ? 40 : direction === 'down' ? -40 : 0),
      x: shouldReduceMotion ? 0 : (direction === 'left' ? 40 : direction === 'right' ? -40 : 0),
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: shouldReduceMotion ? { duration: 0.1 } : {
        duration: 0.6,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1],
      }
    }
  }
  
  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  )
}
