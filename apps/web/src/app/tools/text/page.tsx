import { CategoryToolsList } from '../_lib/categoryPage'

export const metadata = {
  title: 'Text Tools — Zenovee',
  description: 'Text tools. Access requires an active Text Tools plan.',
}

export default function TextToolsPage() {
  return <CategoryToolsList title="Text Tools" category="TEXT" />
}
