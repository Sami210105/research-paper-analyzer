import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  flowchart: { curve: 'basis', padding: 20 },
  themeVariables: {
    primaryColor:   '#F5F0E8',
    primaryBorderColor: '#1A1714',
    primaryTextColor:   '#1A1714',
    lineColor:      '#C9A84C',
    edgeLabelBackground: '#F5F0E8',
  },
})

function MermaidChart({ chart, id }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current || !chart) return
    const uid = `mermaid-${id}-${Date.now()}`
    mermaid.render(uid, chart).then(({ svg }) => {
      if (ref.current) ref.current.innerHTML = svg
    }).catch(err => {
      if (ref.current) ref.current.innerHTML = `<p class="text-xs text-red-500 font-mono">Chart error: ${err.message}</p>`
    })
  }, [chart, id])

  return <div ref={ref} className="mermaid-wrapper overflow-x-auto" />
}

export default function FlowchartView({ flowcharts, methodologies }) {
  const [activeIdx, setActiveIdx] = useState(0)

  if (!flowcharts?.length) return null

  const active = flowcharts[activeIdx]
  const activeMethod = methodologies?.find(m => m.paper_id === active?.paper_id)

  return (
    <section className="px-6 py-4">
      <p className="eyebrow mb-2">Methodology Pipeline</p>
      <h2 className="font-display text-3xl font-bold text-ink dark:text-dark-text mb-4">
        How Each Paper Works
      </h2>

      {/* Paper selector tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {flowcharts.map((f, i) => (
          <button
            key={f.paper_id}
            onClick={() => setActiveIdx(i)}
            className={`font-mono text-xs px-3 py-1.5 border transition-all ${
              activeIdx === i
                ? 'bg-ink dark:bg-gold text-newsprint dark:text-ink border-ink dark:border-gold'
                : 'border-rule dark:border-dark-rule text-muted dark:text-gold hover:border-ink dark:hover:border-gold'
            }`}
          >
            #{String(i + 1).padStart(2, '0')} {f.paper_id.slice(0, 20)}..
          </button>
        ))}
      </div>

      {active && (
        <motion.div
          key={active.paper_id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Flowchart */}
          <div className="border border-rule dark:border-dark-rule p-4">
            <p className="eyebrow mb-4">Visual Pipeline</p>
            <MermaidChart chart={active.mermaid} id={active.paper_id} />
          </div>

          {/* Step-by-step breakdown */}
          <div className="border border-rule dark:border-dark-rule p-4">
            <p className="eyebrow mb-4">Step Breakdown</p>

            {activeMethod?.methodology_steps?.length > 0 ? (
              <ol className="space-y-4">
                {activeMethod.methodology_steps.map((step, i) => (
                  <motion.li
                    key={step.step}
                    className="flex gap-4"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    {/* Step number */}
                    <div className="flex-shrink-0 w-8 h-8 bg-ink dark:bg-gold text-newsprint dark:text-ink font-mono text-xs flex items-center justify-center font-bold">
                      {step.step}
                    </div>

                    {/* Step content */}
                    <div>
                      <h4 className="font-display text-sm font-bold text-ink dark:text-dark-text mb-0.5">
                        {step.title}
                      </h4>
                      <p className="font-body text-xs text-muted dark:text-gold leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            ) : (
              <p className="font-body text-sm text-muted dark:text-gold italic">
                No methodology steps extracted for this paper.
              </p>
            )}
          </div>
        </motion.div>
      )}

      <div className="section-rule mt-6" />
    </section>
  )
}
