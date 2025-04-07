'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-xl"
      >
        <h1 className="text-5xl font-bold mb-4">Stay Organized with TodoFlow</h1>
        <p className="text-gray-400 mb-6 text-lg">
          A modern, full-stack todo app with drag-and-drop, instant edits, and smooth animations.
        </p>
        <Link href="/auth/login">
          <Button className="text-lg px-6 py-3 rounded-full bg-white text-black hover:bg-gray-200 transition">
            Get Started
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"
      >
        {[
          { title: 'Drag & Drop', desc: 'Reorder your todos with smooth drag-and-drop.' },
          { title: 'Instant Edit', desc: 'Click and update instantly. No reloads.' },
          { title: 'Check & Go', desc: 'Mark as done. Stay focused.' },
        ].map((feature, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-300">{feature.desc}</p>
          </div>
        ))}
      </motion.div>

      <footer className="mt-24 text-sm text-gray-500">
        Made with ❤️ by Parth
      </footer>
    </main>
  );
}
