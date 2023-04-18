import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import { encrypt } from '../../utils/crypto'
import { authOptions } from './auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions)

    console.log(session.role)

    if (req.method === 'POST') {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db();

        const existingUser = await db.collection('users').findOne({ email })

        if (existingUser) {
            client.close();
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const encryptedRole = encrypt(role); 

        const newUser = {
            email,
            password: hashedPassword,
            encryptedRole,
        };

        const result = await db.collection('users').insertOne(newUser);
        const createdUser = { ...newUser, id: result.insertedId.toString() };

        client.close();
        return res.status(201).json({ message: 'User created', user: createdUser });
    }

    return res.status(405).json({ message: 'Method not allowed' });
}

export default handler;
