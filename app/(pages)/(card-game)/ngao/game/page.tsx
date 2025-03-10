import NgaoGameComponent from '@/app/(pages)/(card-game)/ngao/game/component';
import { getCardDeck } from '@/app/_libs/card';
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        absolute: 'Game | Ngao',
    },
    description: 'Developed by jiajunlee',
};

export default function NgaoGamePage() {

    const cardDeck = getCardDeck();

    return (
        <>
            <NgaoGameComponent cardDeck={cardDeck} />
        </>
    )
};