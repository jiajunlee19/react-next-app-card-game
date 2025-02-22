import { type TCard, type TBoardCard } from "@/app/_libs/card";
import Image from "next/image";

type CardComponentType = {
    boardCard: TBoardCard,
    handleCardClick?: () => void,
};

export function CardComponent({ boardCard, handleCardClick }: CardComponentType) {

    return (
        <div className="border-4 border-solid border-gray-700 dark:border-gray-300">
            <Image 
                src={(boardCard.card && boardCard.face === 'up') ? `/card-image/${boardCard.card.id}.jpg` : "/card-image/Back.jpg"} 
                alt={(boardCard.card && boardCard.face === 'up') ? `card-${boardCard.card.id}` : "card-back"} 
                width="120" height="120"
                onClick={handleCardClick} 
                className={boardCard.card ? "opacity-100" : "opacity-0"}
                priority={(boardCard.card && boardCard.face === 'up') ? false : true}
                style={{
                    width: '100%',
                    height: 'auto',
                }}
            />
        </div>
    );

};


type CardGridComponentType = {
    children: React.ReactNode,
};

export function CardGridComponent({ children }: CardGridComponentType) {

    return (
        <>
            <section className="grid grid-cols-3 gap-4 place-items-center">
                {children}
            </section>
        </>
    );

};


type StackedCardDeckComponentType = {
    shuffledCardDeck: TCard[],
    handleCardClick: () => void, 
};

export function StackedCardDeckComponent({ shuffledCardDeck, handleCardClick }: StackedCardDeckComponentType) {

    return (
        <div className="flex w-full max-w-[120px] min-h-[150px] mb-4 border-4 border-solid border-gray-700 dark:border-gray-300" onClick={handleCardClick}>
            {shuffledCardDeck.slice(0, 20).map((_, index) => {
                return (
                    <Image 
                        key={index}
                        src="/card-image/Back.jpg" 
                        alt="card-back" 
                        width="120" height="120" 
                        className={index === 0 ? "ml-0" : "max-sm:-ml-[98%] sm:-ml-[110px]"}
                        style={{
                            width: '100%',
                            height: 'auto',
                        }}
                    />
                );
            })}
        </div>
    );

};