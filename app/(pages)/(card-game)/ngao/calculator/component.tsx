"use client"

import { calculateCardLeft, type TDigitValuePairs, type TRemainingCardCounter } from "@/app/_libs/card";
import { useState } from "react";

type TNgaoCalculatorComponent = {

};

 
export default function NgaoCalculatorComponent({ }: TNgaoCalculatorComponent) {

    // States
    const [card1, setCard1] = useState<keyof TDigitValuePairs | null>(null);
    const [card2, setCard2] = useState<keyof TDigitValuePairs | null>(null);


    // Functions


    // Handlers
    const handleReset = () => {
        const confirmReset = window.confirm("Are you sure you want to reset?");
        if (!confirmReset) {
            return;
        }

        setCard1(null);
        setCard2(null);
    };


    return (
        <div className="flex flex-col gap-8 my-4">
            <p className="text">Keep track of what cards are drawn by clicking the &quot;+&quot; and &quot;-&quot; buttons. Select your Card1/Card2 and the probability will be automatically calculated.</p>
            <button className="btn-primary w-fit" onClick={() => handleReset()}>Reset</button>
      
        </div>
    );
};