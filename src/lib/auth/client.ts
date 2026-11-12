'use client'

import { createAuthClient } from '@neon/auth/next'

export type Session = typeof authClient.$Infer.Session
export const authClient = createAuthClient()
