import { useEffect, useState } from "react";
import { Term } from "./Term";
import { StickyScroll } from "./StickyScroll";

type ImageType = "puppet" | "real";

interface Message {
    role: string,
    content: string
}

function connectWebsocket (): Promise<WebSocket> {
    return new Promise((res, rej) => {
        const socket = new WebSocket("http://127.0.0.1:8080/chat");

        socket.addEventListener("open", (_) => res(socket));
        socket.addEventListener("error", (e) => rej(e));
    })
}

export function Chat () {
    const [ image , setImage ] = useState<ImageType>("puppet");
    const [ messages, setMessages ] = useState<Message[]>([]);
    const [ message, setMessage ] = useState('');
    const [ socket, setSocket ] = useState<WebSocket | null>(null);

    function sendMessage () {
        const userMsg: Message = { role: 'user', content: message };
        if (socket) { 
            socket.send(JSON.stringify({ type: 'message', content: userMsg }));
            setMessages(prev => [...prev, userMsg]);
            setMessage('');
        }
    }

    function recieveMessage (message: string) {
        const data = JSON.parse(message);

        console.log(data);

        setMessages(prev => [...prev, { role: data.role, content: data.role == "assistant"? data.content.message: data.content }]);
    }

    useEffect(() => {
        connectWebsocket()
        .then(socket => {
            setSocket(socket);
            socket.addEventListener("message", e => recieveMessage(e.data));
        })
        .catch(console.error);


        // component destructor
        return () => {
            if (socket) {
                socket.close();
                console.log("WebSocket closed.");
            }
        }
    }, [])

    return (
        <div className="flex flex-col w-3/5 min-w-[600px] bg-background rounded-lg py-1 m-5 border-1 border-gray-500 z-2">
            <StickyScroll>
                <img src={`/${image}.jpeg`} className="w-25 rounded-full m-auto mt-10" />
                <h1 className="text-xl text-center m-3">Herta - ChatBot</h1>

                <ul className="w-full mt-10">
                    {
                        messages.map((message, index) => {
                            const shared = "p-2 rounded-lg m-1 w-fit max-w-3/4";
                            const liStyles = "flex flex-nowrap w-fit content-start my-1";
                            const images = "rounded-full w-10 h-fit m-1";
                            if (message.role == 'user') return (
                                <li key={ index } className={`${liStyles} ml-auto justify-end`}>
                                    <span className={`${shared} bg-primary`}>{ message.content }</span>
                                    <img src="https://github.com/yukiisen.png" className={`${images} ${message.role == messages[index - 1]?.role? "invisible": "visible"}`}/>
                                </li> 
                            )
                            else if (message.role == 'assistant') return (
                                <li key={ index } className={liStyles}>
                                    <img src={`/${image}.jpeg`} className={`${images} ${messages[index - 1].role !== 'user'? "invisible": "visible"}`} />
                                    <span className={`${shared} bg-accent`}>{ message.content }</span>
                                </li>
                            )
                            // command:
                            else return (
                                <li key={ index } className={liStyles}>
                                    <img src={`/${image}.jpeg`} className={`${images} ${messages[index - 1].role !== 'user'? "invisible": "visible"}`} />
                                    <Term command={JSON.parse(message.content).command} stdout={JSON.parse(message.content).stdout.split("\n")} />
                                </li>
                            )
                        })
                    }
                </ul>
            </StickyScroll>

            <form className="flex p-3 px-8" onSubmit={(e) => { e.preventDefault(); sendMessage() }}>
                <input 
                    type="text" 
                    placeholder="Type Something..." 
                    className="flex-1 p-2 focus:outline-none border-2 border-primary rounded-lg"
                    value={message}
                    onChange={(e) => setMessage((e.target as HTMLInputElement).value)}
                />
                <button className="bg-primary px-5 py-2 rounded-lg ml-1" type="submit">Send</button>
            </form>
        </div>
    )
}
