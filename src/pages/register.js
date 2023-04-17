import { useState } from 'react';
import Link from 'next/link';

export default function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [role, setRole] = useState('user')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            alert("Passwords don't match")
            return
        }

        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, role }),
        });

        if (response.ok) {
            alert('User created successfully');
        } else {
            const error = await response.json();
            console.error('ERROR:', error);
        }
    }

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <label>
                Email:
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </label>
                <label>
                Password:
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </label>
                <label>
                Confirm Password:
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </label>
                <select
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <button type="submit">Submit</button>
                <p>Already have an account? <Link href="/login">Login</Link></p>
            </form>
        </div>
    )
}

