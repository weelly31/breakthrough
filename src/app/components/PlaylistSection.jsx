"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, PlayCircle } from 'lucide-react';

const PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLVnRGls9eWxCCqIJ_dxAC7h2i1HQ9_bh4';
const PLAYLIST_ID = 'PLVnRGls9eWxCCqIJ_dxAC7h2i1HQ9_bh4';

const playlistVideos = [
  {
    label: 'Playlist 1',
    videoId: 'KZwppyRFLkc',
    index: 2,
    watchUrl: 'https://www.youtube.com/watch?v=KZwppyRFLkc&list=PLVnRGls9eWxCCqIJ_dxAC7h2i1HQ9_bh4&index=2',
  },
  {
    label: 'Playlist 2',
    videoId: 'JjgkhHlTROQ',
    index: 3,
    watchUrl: 'https://www.youtube.com/watch?v=JjgkhHlTROQ&list=PLVnRGls9eWxCCqIJ_dxAC7h2i1HQ9_bh4&index=3',
  },
  {
    label: 'Playlist 3',
    videoId: 'CZdKZFlCcx4',
    index: 4,
    watchUrl: 'https://www.youtube.com/watch?v=CZdKZFlCcx4&list=PLVnRGls9eWxCCqIJ_dxAC7h2i1HQ9_bh4&index=4',
  },
  {
    label: 'Playlist 4',
    videoId: '9tGnhSg-Hec',
    index: 5,
    watchUrl: 'https://www.youtube.com/watch?v=9tGnhSg-Hec&list=PLVnRGls9eWxCCqIJ_dxAC7h2i1HQ9_bh4&index=5',
  },
  {
    label: 'Playlist 5',
    videoId: 'KwX1f2gYKZ4',
    index: 6,
    watchUrl: 'https://www.youtube.com/watch?v=KwX1f2gYKZ4&list=PLVnRGls9eWxCCqIJ_dxAC7h2i1HQ9_bh4&index=6',
  },
  {
    label: 'Playlist 6',
    videoId: 'vx6mfAgHDsY',
    index: 7,
    watchUrl: 'https://www.youtube.com/watch?v=vx6mfAgHDsY&list=PLVnRGls9eWxCCqIJ_dxAC7h2i1HQ9_bh4&index=7',
  },
  {
    label: 'Playlist 7',
    videoId: 'YNd-PbVhnvA',
    index: 8,
    watchUrl: 'https://www.youtube.com/watch?v=YNd-PbVhnvA&list=PLVnRGls9eWxCCqIJ_dxAC7h2i1HQ9_bh4&index=8',
  },
  {
    label: 'Playlist 8',
    videoId: 'johgSkNj3-A',
    index: 9,
    watchUrl: 'https://www.youtube.com/watch?v=johgSkNj3-A&list=PLVnRGls9eWxCCqIJ_dxAC7h2i1HQ9_bh4&index=9',
  },
  {
    label: 'Playlist 9',
    videoId: 'qOD9M95_fS0',
    index: 10,
    watchUrl: 'https://www.youtube.com/watch?v=qOD9M95_fS0&list=PLVnRGls9eWxCCqIJ_dxAC7h2i1HQ9_bh4&index=10',
  },
  {
    label: 'Playlist 10',
    videoId: 'lC_eI8B1qGI',
    index: 11,
    watchUrl: 'https://www.youtube.com/watch?v=lC_eI8B1qGI&list=PLVnRGls9eWxCCqIJ_dxAC7h2i1HQ9_bh4&index=11',
  },
  {
    label: 'Playlist 11',
    videoId: 'g_0asWp1j_c',
    index: 1,
    watchUrl: 'https://www.youtube.com/watch?v=g_0asWp1j_c&list=PLVnRGls9eWxCCqIJ_dxAC7h2i1HQ9_bh4&index=1',
  },
].map((video) => ({
  ...video,
  embedUrl: `https://www.youtube.com/embed/${video.videoId}?list=${PLAYLIST_ID}&index=${video.index}`,
}));

export default function PlaylistSection() {
  return (
    <section id="playlist" className="relative overflow-hidden bg-linear-to-b from-[#f7f4ef] via-[#f6f8fb] to-white py-24 md:py-30">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#f4b25f]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-8 h-80 w-80 rounded-full bg-[#81a9ca]/18 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">Summer Retreat Playlist</p>
          <h2 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">Prepare Your Heart Before Camp</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            Listen to worship and retreat messages from YouTube playlist. We included all 11 shared videos below so everyone can watch directly from the retreat page.
          </p>
          <a
            href={PLAYLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-[0_12px_28px_rgba(15,23,42,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-500/55 hover:text-amber-700"
          >
            Open Full Playlist
            <ExternalLink size={16} />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, delay: 0.1 }}
          className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_26px_65px_rgba(15,23,42,0.13)] sm:p-4"
        >
          <div className="aspect-video w-full overflow-hidden rounded-2xl bg-slate-900">
            <iframe
              src={`https://www.youtube.com/embed/videoseries?list=${PLAYLIST_ID}`}
              title="Summer Retreat 2026 Playlist"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </motion.div>

        <div className="mb-6 px-1 text-center text-sm font-medium text-slate-500 sm:text-left">
          All Shared Videos (11)
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {playlistVideos.map((video, i) => (
            <motion.div
              key={video.videoId}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.12 + i * 0.1 }}
              className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3 shadow-[0_14px_30px_rgba(15,23,42,0.08)]"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">
                  <PlayCircle size={14} />
                  {video.label}
                </div>
                <a
                  href={video.watchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition-colors hover:border-amber-400/60 hover:text-amber-700"
                >
                  Watch
                  <ExternalLink size={12} />
                </a>
              </div>
              <div className="aspect-video overflow-hidden rounded-xl bg-slate-900">
                <iframe
                  src={video.embedUrl}
                  title={`${video.label} video embed`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
