"use client"

import { useEffect, useMemo, useState } from 'react'

import { getActiveEntitlements, hasCategory, type Entitlement, type ToolCategory } from '@/lib/entitlements'
import { ToolLocked } from './ToolLocked'

export function ToolGatePlaceholder({
  requiredCategory,
  onUnlock,
  children,
}: {
  requiredCategory: ToolCategory
  onUnlock?: () => void
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [entitlements, setEntitlements] = useState<Entitlement[]>([])

  const canUse = useMemo(
    () => hasCategory(entitlements, requiredCategory),
    [entitlements, requiredCategory],
  )

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const ents = await getActiveEntitlements()
        if (!mounted) return
        setEntitlements(ents)
      } catch {
        // Not logged in => locked
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  // Notify once unlocked (best-effort). Must be unconditional to satisfy Rules of Hooks.
  useEffect(() => {
    if (loading) return
    if (!canUse) return
    onUnlock?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, canUse])

  if (loading) {
    return <p className="text-sm text-zinc-600 dark:text-zinc-300">Checking access…</p>
  }

  if (!canUse) {
    const label: Record<ToolCategory, string> = {
      MARKETING: 'AI Marketing Engine',
      DEV_ASSISTANT: 'AI Developer Assistant',
      ECOM_IMAGE: 'E-commerce Image Engine',
      SEO_GROWTH: 'SEO Growth Engine',
      BUSINESS_AUTOMATION: 'Business Automation Toolkit',
    }
    return <ToolLocked category={label[requiredCategory]} />
  }

  return <>{children}</>
}
