import type { Metadata } from 'next'
import GemTDUrsolTrainerComponent from './component';

export const metadata: Metadata = {
    title: {
        absolute: 'GemTD | Ursol Trainer',
    },
    description: 'Developed by jiajunlee',
};

export default function GemTDUrsolTrainerPage() {


    return (
        <>
            <GemTDUrsolTrainerComponent />
        </>
    )
};