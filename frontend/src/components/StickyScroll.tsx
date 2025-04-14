import { useEffect, useRef } from "react";


export const StickyScroll = ({ children }: { children: React.ReactNode }) => {
    const element = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = element.current;
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
    }, [children])

    return (
        <div ref={element} className="w-full py-5 px-10 flex-1 overflow-y-auto">
            { children }
        </div>
    )
}
