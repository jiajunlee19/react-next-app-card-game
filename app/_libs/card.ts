// Define all possible suits and values
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;
const suits = ['♦', '♣', '♥', '♠'] as const;
const digits = [1, 2, 3 ,4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const;
const counts = [0, 1, 2, 3, 4] as const;


// Define type for each card
export type TCard = {
    id: `${typeof values[number]}${typeof suits[number]}`,
    digit: typeof digits[number], 
    value: typeof values[number], 
    suit: typeof suits[number],
    src: string,
};

// Define type for each card in the board
export type TBoardCard = {
    cardNumber: "c1" | "c2" | "c3",
    face: "up" | "down",
    card: TCard | null,
};

// Define type for remaining card counter
export type TRemainingCardCounter = {
    [key in typeof digits[number]]: typeof counts[number]
};


// getCardDeck() returns a list of 52 cards, each with unique value+suit combination
// [
//     { id: 'A♦', digit: '1', value: 'A', suit: '♦', src: '/card-image/A♦.jpg' },
//         ...         ...
//     { id: 'K♠', digit: '13', value: 'K', suit: '♠', src: '/card-image/K♠.jpg' },
// ]
export function getCardDeck() {

    // Create all possible card combinations to form a card deck
    const cardDeck: TCard[] = [];
    values.forEach((value, index) => {

        const digit = digits[index];

        suits.forEach(suit => {
            cardDeck.push({
                id: `${value}${suit}`,
                digit: digit,
                value: value,
                suit: suit,
                src: `/card-image/${value}${suit}.jpg`,
            });
        });

    });

    return cardDeck;

};


// shuffle() returns a shuffled list, using Fisher-Yates Sorting Algorithm
export function shuffleCardDeck(cardDeck: TCard[]) {

    // Starting from the end of card until the beginning, keep swapping the current card with a random card before it.
    for (let i = cardDeck.length-1; i>0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [cardDeck[i], cardDeck[j]] = [cardDeck[j], cardDeck[i]]
    };

    return [...cardDeck];

};


// getInitialCardCounter() returns a dict with format of {digit: count}
// eg: {1: 4, 2:4, 3:4, ..., 13:4}
export function getInitialCardCounter() {

    const remainingCardCounter: TRemainingCardCounter = {} as TRemainingCardCounter;
    
    digits.forEach((digit) => {
        remainingCardCounter[digit] = 4;
    });

    return remainingCardCounter;

};


export function calculateCardLeft(cardMin: typeof digits[number], cardMax: typeof digits[number], remainingCardCounter: TRemainingCardCounter, mode: "hit" | "notInBetween" | "inBetween") {
    
    // Swap min-max if reversed
    if (cardMin > cardMax) {
        [cardMin, cardMax] = [cardMax, cardMin]
    }

    let cardLeft = 0;

    if (mode === "hit") {
        if (cardMin === cardMax) cardLeft += remainingCardCounter[cardMin];
        else cardLeft += remainingCardCounter[cardMin] + remainingCardCounter[cardMax];

    } else if (mode === "inBetween" && cardMin+1 <= 13) {
        for (let i=cardMin+1; i<cardMax; i++) {
            cardLeft += remainingCardCounter[i as typeof digits[number]];
        };
        
    } else if (mode === "notInBetween") {
        for (let i=1; i<cardMin; i++) {
            cardLeft += remainingCardCounter[i as typeof digits[number]];
        };
        if (cardMax+1 <= 13) {
            for (let i=cardMax+1; i<=13; i++) {
                cardLeft += remainingCardCounter[i as typeof digits[number]];
            }
        };
    }

    return cardLeft;
}