import SignUpComponent from "@/app/(pages)/restricted/auth/user/signUp/component";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign Up',
    description: 'Developed by jiajunlee',
};

export default function SignUpPage() {
    return <SignUpComponent />
};