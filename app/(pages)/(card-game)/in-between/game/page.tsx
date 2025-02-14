import { getCardDeck } from '@/app/_libs/card';
import InBetweenComponent from '@/app/(pages)/(card-game)/in-between/game/component';
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        absolute: 'Game | In-Between',
    },
    description: 'Developed by jiajunlee',
};

export default function InBetweenGamePage() {

    const cardDeck = getCardDeck();

    return (
        <>
            <InBetweenComponent cardDeck={cardDeck} />
        </>
    )
};