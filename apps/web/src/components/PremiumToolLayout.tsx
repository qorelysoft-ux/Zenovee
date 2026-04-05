'use client'

import React, { useState } from 'react'
import { Copy, Download, RotateCcw } from 'lucide-react'

interface PremiumToolLayoutProps {
  toolName: string
  toolDescription: string
  category: string
  categoryHref: string
  children: React.ReactNode
}

export function PremiumToolLayout({
  toolName,
  toolDescription,
  category,
  categoryHref,
  children,
}: PremiumToolLayoutProps) {
  const [activeTab, setActiveTab] = useState<'result' | 'history'>('result')

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-1/4 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute right-1/4 -bottom-1/4 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="border-b border-white/10 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {/* Breadcrumb */}
            <div className="text-sm text-slate-400 mb-6">
              <a href="/tools" className="hover:text-slate-300">Tools</a>
              <span className="mx-2">/</span>
              <a href={categoryHref} className="hover:text-slate-300">{category}</a>
              <span className="mx-2">/</span>
              <span className="text-white">{toolName}</span>
            </div>

            {/* Title section */}
            <div className="max-w-2xl">
              <div className="inline-flex rounded-lg bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-300 mb-4">
                {category}
              </div>
              <h1 className="text-4xl font-bold text-white sm:text-5xl">{toolName}</h1>
              <p className="mt-4 text-lg text-slate-300 leading-relaxed">{toolDescription}</p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-2">
            {/* Input side */}
            <div className="space-y-6">
              <div className="glass-lg p-8">
                <h2 className="text-xl font-bold text-white mb-6">Tool Settings</h2>
                <div className="space-y-6">
                  {children}
                </div>
              </div>
            </div>

            {/* Output side */}
            <div className="space-y-6">
              <div className="glass-lg p-8 min-h-96 flex flex-col">
                {/* Tabs */}
                <div className="flex border-b border-white/10 mb-6">
                  <button
                    onClick={() => setActiveTab('result')}
                    className={`px-4 py-2 text-sm font-semibold transition-colors ${
                      activeTab === 'result'
                        ? 'border-b-2 border-violet-400 text-white'
                        : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    Result
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`px-4 py-2 text-sm font-semibold transition-colors ${
                      activeTab === 'history'
                        ? 'border-b-2 border-violet-400 text-white'
                        : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    Recent Runs
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-h-64 text-slate-400 text-sm flex items-center justify-center">
                  {activeTab === 'result' ? (
                    <p>Run the tool to see results here</p>
                  ) : (
                    <p>Recent runs will appear here</p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="mt-6 flex gap-3">
                  <button className="flex items-center gap-2 rounded-lg bg-violet-500/20 px-4 py-2 text-sm font-semibold text-violet-300 hover:bg-violet-500/30 transition-colors">
                    <Copy className="h-4 w-4" />
                    Copy
                  </button>
                  <button className="flex items-center gap-2 rounded-lg bg-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-300 hover:bg-blue-500/30 transition-colors">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                  <button className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10 transition-colors">
                    <RotateCcw className="h-4 w-4" />
                    Regenerate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ToolInputField({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
}: {
  label: string
  placeholder: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}) {
  const isTextarea = type === 'textarea'

  return (
    <div>
      <label className="block text-sm font-semibold text-white mb-3">{label}</label>
      {isTextarea ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 transition-colors"
          rows={5}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 transition-colors"
        />
      )}
    </div>
  )
}

export function ToolRunButton({ onClick, loading = false }: { onClick: () => void; loading?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="btn-premium w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Processing...
        </>
      ) : (
        <>⚡ Run Tool</>
      )}
    </button>
  )
}
