import { CategoryToolsList } from '../_lib/categoryPage'

export const metadata = {
  title: 'Developer Tools — Zenovee',
  description: 'Developer tools. Access requires an active Developer Tools plan.',
}

export default function DeveloperToolsPage() {
  return <CategoryToolsList title="Developer Tools" category="DEVELOPER" />
}
