"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function AuthTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="min-h-screen w-full"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.995 }}
      animate={reduceMotion ? false : { opacity: 1, scale: 1 }}
      transition={{
        duration: 0.32,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
