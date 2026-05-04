export const motion = {
  section: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
  card: {
    whileHover: { y: -3 },
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const },
  },
};
