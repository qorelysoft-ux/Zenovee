import { CategoryToolsList } from '../_lib/categoryPage'

export const metadata = {
  title: 'AI Developer Assistant — Zenovee',
  description: 'Developer tools that save hours on documentation, debugging, SQL, regex, and APIs.',
}

export default function DevAssistantToolsPage() {
  return <CategoryToolsList title="AI Developer Assistant" category="DEV_ASSISTANT" />
}