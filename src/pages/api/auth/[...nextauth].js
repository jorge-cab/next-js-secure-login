import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import { decrypt } from '../../../utils/crypto'

const clientPromise = MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            id: 'credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const client = await MongoClient.connect(process.env.MONGODB_URI);
                const db = client.db();

                const user = await db.collection('users').findOne({ email: credentials.email })

                console.log("ROLE")
                if (!user) {
                    client.close();
                    throw new Error('No user found');
                }

                const isValidPassword = await bcrypt.compare(credentials.password, user.password);

                if (!isValidPassword) {
                    client.close();
                    throw new Error('Invalid password');
                }

                const role = decrypt(user.encryptedRole.encrypted, user.encryptedRole.authTag);

                client.close();

                return { id: user._id.toString(), email: user.email, role: role}
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    adapter: MongoDBAdapter(clientPromise),
    pages: {
        signIn: '/login',
        error: '/unauthorized',
    },
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if(user) {
                token.id = user.id
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            session.id = token.id
            session.role = token.role
            return session
        }
    }
}

export default NextAuth(authOptions)
