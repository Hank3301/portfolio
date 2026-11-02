'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode, isValidElement, cloneElement, Children, CSSProperties } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  once?: boolean;
  stagger?: number;
}

const directionVariants = {
  up: { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
};

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  once = true,
  stagger = 0,
}: ScrollRevealProps) {
  const childArray = Children.toArray(children);

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-100px' }}
      variants={directionVariants[direction]}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay }}
    >
      {childArray.map((child, index) => {
        if (!isValidElement(child)) return child;
        const childProps = child.props as { style?: CSSProperties };
        const style: CSSProperties = {
          ...(childProps.style || {}),
          transitionDelay: `${delay + index * stagger}s`,
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return cloneElement(child, { style } as any);
      })}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className = '',
  delay = 0,
  stagger = 0.1,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Novo componente FadeIn simplificado para uso direto
export function FadeIn({
  children,
  className = '',
  delay = 0,
  direction: dir = 'up',
  once = true,
  ...props
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  once?: boolean;
} & Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'variants' | 'viewport' | 'transition'>) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-100px' }}
      variants={directionVariants[dir]}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}