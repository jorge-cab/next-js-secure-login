import { useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react'

export default function Dashboard() {
    const { data: session, status } = useSession(); 

    useEffect(() => {
        console.log(status)
        if (session) {
            console.log(session.role)
        }
        if (status === 'authenticated' && !session) {
            console.log('FAILED')
        }
    }, [status, session]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <Link href='/admin'>Admin</Link> 
            <Link href='/userpage'>User Page</Link> 
            <button onClick={() => signOut({callbackUrl: "/"})}>Sign Out</button> 
        </div>
    )
}

