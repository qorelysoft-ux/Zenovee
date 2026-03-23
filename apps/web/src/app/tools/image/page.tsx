import { CategoryToolsList } from '../_lib/categoryPage'

export const metadata = {
  title: 'Image Tools — Zenovee',
  description: 'Image tools. Access requires an active Image Tools plan.',
}

export default function ImageToolsPage() {
  return <CategoryToolsList title="Image Tools" category="IMAGE" />
}
