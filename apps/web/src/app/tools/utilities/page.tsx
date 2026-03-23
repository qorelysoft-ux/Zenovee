import { CategoryToolsList } from '../_lib/categoryPage'

export const metadata = {
  title: 'Utility Tools — Zenovee',
  description: 'Utility tools. Access requires an active Utility Tools plan.',
}

export default function UtilityToolsPage() {
  return <CategoryToolsList title="Utility Tools" category="UTILITY" />
}
