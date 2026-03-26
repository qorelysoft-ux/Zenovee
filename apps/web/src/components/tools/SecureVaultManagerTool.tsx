"use client"

import { useState } from 'react'

function xorEncrypt(text: string, key: string) {
  if (!key) return ''
  return btoa(
    Array.from(text)
      .map((char, i) => String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length)))
      .join(''),
  )
}

function xorDecrypt(text: string, key: string) {
  if (!key) return ''
  const decoded = atob(text)
  return Array.from(decoded)
    .map((char, i) => String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length)))
    .join('')
}

export function SecureVaultManagerTool() {
  const [secret, setSecret] = useState('Database password or internal note')
  const [key, setKey] = useState('my-secret-key')
  const [cipher, setCipher] = useState('')
  const [plain, setPlain] = useState('')

  return <div className="space-y-4"><textarea value={secret} onChange={(e)=>setSecret(e.target.value)} rows={6} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700"/><input value={key} onChange={(e)=>setKey(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" placeholder="Encryption key"/><div className="flex gap-3"><button onClick={()=>setCipher(xorEncrypt(secret,key))} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-zinc-900">Encrypt</button><button onClick={()=>setPlain(cipher ? xorDecrypt(cipher,key) : '')} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700">Decrypt</button></div><pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{cipher || 'Encrypted output will appear here.'}</pre><pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{plain || 'Decrypted output will appear here.'}</pre></div>
}
