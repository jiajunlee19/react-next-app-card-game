import type { Metadata } from 'next'
import NgaoCalculatorComponent from '@/app/(pages)/(card-game)/ngao/calculator/component';

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