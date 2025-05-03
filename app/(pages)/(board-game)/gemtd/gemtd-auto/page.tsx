import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        absolute: 'GemTD | Auto',
    },
    description: 'Developed by jiajunlee',
};

export default function GemTDAutoPage() {

    const [amount, currency] = ["500", "MYR"];
    const wiseUrl = `https://wise.com/pay/me/jiajunl139?amount=${amount}&currency=${currency}`;
    const wiseReferralUrl = "https://wise.com/invite/ahpn/jiajunl139";

    return (
        <>
            <div className="flex flex-col gap-0">
                <h2>Gemtd-Auto</h2>

                <div className="mb-4">
                    <h3>Wanted to AFK in gemtd without physically present to accept games?</h3>
                    <p>The gemtd-auto bot is explicitly designed into gemtd afk requirements, supports below features:</p>
                    <ul className="list-inside list-decimal">
                        <li className="text">Auto send defined instruction chat into gemtd channel every 10mins as long as its not in a game and ready to play, to attract yourself to be invited to a game</li>
                        <li className="text">Auto accept party invites, as long as its not in a game and ready to play</li>
                        <li className="text">Auto accept game ready, you dont have to be coach for this</li>
                        <li className="text">Auto select heroes based on latest in-game chat message, prompted based on hash-enclosed keywords #XXXXXX#</li>
                        <li className="text">Auto click continue on post-game (win/lose) to return into main lobby</li>
                        <li className="text">Auto reconnect if disconnected, checked every 10mins (unless theres a long network down)</li>
                        <li className="text">Repeats everything in an interval of 5 seconds, until user clicked CTRL+C to stop the script</li>
                        <li className="text">Auto check if game is outdated. If outdated, an email will be sent over to notify user to manually restart the game and the script.</li>
                    </ul>
                </div>

                <h3>Interested to buy the bot ?</h3>
                <p>You will receive a zip file with executable to run the bot, no programming skills needed, anyone can run the executable.</p>
                <p>The bot works for lifetime, show support by buying it with MYR500 ! Only Wise Payment is supported now.</p>
                <div className="flex gap-8 mt-4">
                    <a href={wiseReferralUrl} target="_blank" rel="noopener noreferrer">
                        <button className="btn-secondary rounded-md px-4 py-2">New to Wise? Redeem free card or transfer up to MYR2500</button>
                    </a>
                    <a href={wiseUrl} target="_blank" rel="noopener noreferrer">
                        <button className="btn-primary rounded-md px-4 py-2">Pay Me with Wise</button>
                    </a>
                </div>
            </div>
        </>
    )
};