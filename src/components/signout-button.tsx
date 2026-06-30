import { signOut } from '@/app/(auth)/actions'

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        style={{
          background: 'transparent',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          padding: '0.4rem 0.9rem',
          color: 'var(--color-text)',
          cursor: 'pointer',
        }}
      >
        Sign out
      </button>
    </form>
  )
}