import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react'


export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        const result = await signIn('credentials', {
            redirect: false,
            callbackUrl: '/',
            email,
            password,
        });

        if (!result.error) {
            window.location.href = '/dashboard'
        } else {
            alert(result.error)
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label>
                Email:
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </label>
                <label>
                Password:
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </label>
                <button type="submit">Submit</button>
                <p>Don&apos;t have an account? <Link href='/register'>Register</Link></p>
            </form>
        </div>
    )
}
