import NgaoCalculatorComponent from '@/app/(pages)/(card-game)/ngao/calculator/component';
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        absolute: 'Calculator | Ngao',
    },
    description: 'Developed by jiajunlee',
};

export default function NgaoCalculatorPage() {

    return (
        <>
            <NgaoCalculatorComponent />
        </>
    )
};