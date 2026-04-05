// SimplifiedToolWrapper.tsx - Clean, simple tool interface component
import React from 'react'

interface ToolWrapperProps {
  toolName: string
  toolDescription: string
  category: string
  children: React.ReactNode // The actual tool form/input component
}

export const SimplifiedToolWrapper = ({ toolName, toolDescription, category, children }: ToolWrapperProps) => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* HEADER */}
      <section className="mb-12">
        <div className="inline-flex rounded-lg bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-300 mb-4">
          {category}
        </div>
        <h1 className="text-4xl font-bold text-white">{toolName}</h1>
        <p className="mt-3 text-lg text-slate-300 max-w-2xl">{toolDescription}</p>
      </section>

      {/* TOOL FORM SECTION */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-8 mb-12">
        <h2 className="text-xl font-semibold text-white mb-6">Run Tool</h2>
        <div className="space-y-6">
          {children}
        </div>
      </section>

      {/* ACTION BUTTONS TEMPLATE FOR OUTPUTS */}
      <section className="text-center text-sm text-slate-400">
        <p>Results will appear below with options to copy, download, or regenerate.</p>
      </section>
    </div>
  )
}

// ToolOutputView.tsx - Clean output display component
interface ToolOutputViewProps {
  output: any
  isLoading: boolean
  onCopy?: () => void
  onDownload?: () => void
  onRegenerate?: () => void
}

export const ToolOutputView = ({ output, isLoading, onCopy, onDownload, onRegenerate }: ToolOutputViewProps) => {
  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-violet-400/30 border-t-violet-400" />
            <p className="mt-4 text-slate-300">Processing your request...</p>
          </div>
        </div>
      ) : output ? (
        <>
          <div className="rounded-lg border border-white/10 bg-white/5 p-6 max-h-96 overflow-auto">
            {typeof output === 'string' ? (
              <p className="whitespace-pre-wrap text-sm text-white">{output}</p>
            ) : (
              <pre className="text-sm text-white">{JSON.stringify(output, null, 2)}</pre>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {onCopy && (
              <button
                onClick={onCopy}
                className="rounded-lg bg-violet-500/20 px-4 py-2 text-sm font-medium text-violet-300 hover:bg-violet-500/30"
              >
                Copy
              </button>
            )}
            {onDownload && (
              <button
                onClick={onDownload}
                className="rounded-lg bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-300 hover:bg-blue-500/30"
              >
                Download
              </button>
            )}
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10"
              >
                Regenerate
              </button>
            )}
          </div>
        </>
      ) : null}
    </section>
  )
}

// ToolInputForm.tsx - Simplified input component
interface ToolInputFormProps {
  onSubmit: (data: any) => void
  isLoading: boolean
  fields: {
    name: string
    label: string
    type: 'text' | 'textarea' | 'select' | 'checkbox'
    required?: boolean
    placeholder?: string
    options?: { label: string; value: string }[]
  }[]
}

export const ToolInputForm = ({ onSubmit, isLoading, fields }: ToolInputFormProps) => {
  const [formData, setFormData] = React.useState<Record<string, any>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-white mb-2">{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea
              value={formData[field.name] || ''}
              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              placeholder={field.placeholder}
              required={field.required}
              rows={5}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-violet-400/50 focus:outline-none"
            />
          ) : field.type === 'select' && field.options ? (
            <select
              value={formData[field.name] || ''}
              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              required={field.required}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:border-violet-400/50 focus:outline-none"
            >
              <option value="">Select {field.label}</option>
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : field.type === 'checkbox' ? (
            <input
              type="checkbox"
              checked={formData[field.name] || false}
              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.checked })}
              className="rounded border border-white/10 bg-white/5"
            />
          ) : (
            <input
              type={field.type}
              value={formData[field.name] || ''}
              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              placeholder={field.placeholder}
              required={field.required}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-violet-400/50 focus:outline-none"
            />
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 w-full rounded-lg bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-3 font-semibold text-white hover:scale-105 disabled:opacity-50 transition-transform"
      >
        {isLoading ? 'Processing...' : 'Run Tool'}
      </button>
    </form>
  )
}
