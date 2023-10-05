import useDisablePinchZoom from "@/hooks/use-disable-zoom";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { Hash } from "lucide-react";
import { useEffect } from "react";

interface ChatWelcomeProps {
    name: string;
    type: "channel" | "conversation";
}

export const ChatWelcome = ({
    name,
    type
}: ChatWelcomeProps) => {
    useDisablePinchZoom();
    return(
        <div className="space-y-2 px-4 mb-4">
{/* 
            <button onClick={updateUser}>Click me to update your name</button>
            <p>user.firstName: {user?.firstName}</p>
            <p>user.lastName: {user?.lastName}</p> */}
            {/* <button onClick={updateUser}>Click me to update your metadata</button>
            <p>user role: {user?.publicMetadata?.role}</p> */}
            {type === "channel" && (
                <div className="h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center">
                    <Hash className="h-12 w-12 text-white"/>
                </div>
            )}
            <p className="text-xl md:text-3xl font-bold">
                {type === "channel" ? "Welcome to #" : ""}{name}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                {type === "channel"
                    ? `This is the start of the #${name} channel.` : `This is the start of your conversation with ${name}`
                }

            </p>
        </div>
    )
}