import {auth } from '@/lib/firebase/firebase'

function getCurrentUserId(){
    const user = auth.currentUser;
    return user ? user.uid : "";
}

export {getCurrentUserId}