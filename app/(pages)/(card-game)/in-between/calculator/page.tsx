import InBetweenCalculatorComponent from '@/app/(pages)/(card-game)/in-between/calculator/component';
import { getDigitValuePairs, getInitialCardCounter } from "@/app/_libs/card";
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        absolute: 'Calculator | In-Between',
    },
    description: 'Developed by jiajunlee',
};

export default function InBetweenCalculatorPage() {

    const digitValuePairs = getDigitValuePairs();
    const initialCardCounter = getInitialCardCounter();

    return (
        <>
            <InBetweenCalculatorComponent digitValuePairs={digitValuePairs} initialCardCounter={initialCardCounter} />
        </>
    )
};