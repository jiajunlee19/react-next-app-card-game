import NgaoCalculatorComponent from '@/app/(pages)/(card-game)/ngao/calculator/component';
import { getDigitValuePairs, getInitialCardCounter } from "@/app/_libs/card";
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        absolute: 'Calculator | Ngao',
    },
    description: 'Developed by jiajunlee',
};

export default function NgaoCalculatorPage() {

    const digitValuePairs = getDigitValuePairs();
    const initialCardCounter = getInitialCardCounter();
    
    return (
        <>
            <NgaoCalculatorComponent digitValuePairs={digitValuePairs} initialCardCounter={initialCardCounter} />
        </>
    )
};