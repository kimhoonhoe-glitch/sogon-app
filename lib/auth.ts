import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

const providers: any[] = [
  CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        mode: { label: 'Mode', type: 'text' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials')
            return null
          }

          const mode = (credentials as any).mode || 'login'
          console.log('Auth attempt:', credentials.email, 'mode:', mode)

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          if (mode === 'signup') {
            if (user) {
              console.log('User already exists')
              return null
            }
            
            console.log('Creating new user')
            const hashedPassword = await bcrypt.hash(credentials.password, 10)
            const newUser = await prisma.user.create({
              data: {
                email: credentials.email,
                name: credentials.email.split('@')[0],
                password: hashedPassword,
                subscription: {
                  create: {
                    status: 'free',
                    plan: 'free',
                  },
                },
              },
            })
            console.log('New user created:', newUser.id)
            return newUser
          }

          if (mode === 'login') {
            if (!user) {
              console.log('User not found')
              return null
            }

            if (!user.password) {
              console.log('User has no password')
              return null
            }

            const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
            if (!isPasswordValid) {
              console.log('Invalid password')
              return null
            }

            console.log('Login successful')
            return user
          }

          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
]

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.unshift(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  )
}

export const authOptions: NextAuthOptions = {
  providers,
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}
