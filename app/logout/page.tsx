"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

import { auth } from '@/lib/firebase/firebase';

const LogoutPage = () => {
    const router = useRouter();

    useEffect(() => {
        signOut(auth)
            .then(() => {
                router.push('/');
            })
            .catch((error) => {
                console.error('Error signing out: ', error);
            });
    }, [router]);

    return null;
};

export default LogoutPage;