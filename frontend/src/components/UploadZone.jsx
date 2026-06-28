import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function UploadZone({ onFilesSelected, files }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.pdf'))
    if (dropped.length) onFilesSelected(dropped)
  }

  const handleChange = (e) => {
    const selected = Array.from(e.target.files)
    if (selected.length) onFilesSelected(selected)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Upload zone styled as newspaper ad box */}
      <motion.div
        className={`border-4 border-dashed transition-all duration-200 p-10 text-center cursor-pointer
          ${dragging
            ? 'border-gold bg-gold/10'
            : 'border-rule dark:border-dark-rule hover:border-ink dark:hover:border-gold'
          }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf"
          className="hidden"
          onChange={handleChange}
        />

        <div className="font-display text-6xl mb-4 select-none">
          {dragging ? '📰' : '📄'}
        </div>

        <p className="eyebrow mb-2">Submit for Analysis</p>

        <h2 className="font-display text-2xl font-bold text-ink dark:text-dark-text mb-2">
          Drop Your Research Papers Here
        </h2>

        <p className="font-body text-muted dark:text-gold text-sm">
          Accepts PDF files · Up to 50 papers · Drag & drop or click to browse
        </p>
      </motion.div>

      {/* File list styled as table of contents */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            className="mt-6 border border-rule dark:border-dark-rule"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="border-b-4 border-ink dark:border-dark-text px-4 py-2">
              <span className="eyebrow">Table of Contents</span>
            </div>

            <ul className="divide-y divide-rule dark:divide-dark-rule">
              {files.map((file, i) => (
                <motion.li
                  key={file.name}
                  className="flex justify-between items-center px-4 py-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-gold w-6">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-body text-sm text-ink dark:text-dark-text truncate max-w-xs">
                      {file.name.replace('.pdf', '')}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-muted dark:text-gold ml-4 shrink-0">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                </motion.li>
              ))}
            </ul>

            <div className="px-4 py-2 border-t border-rule dark:border-dark-rule">
              <span className="font-mono text-xs text-muted dark:text-gold">
                {files.length} paper{files.length > 1 ? 's' : ''} ready for analysis
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
