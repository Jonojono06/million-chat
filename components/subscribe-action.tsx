"use client"

import { BadgeCheck, BadgeX, Plus } from "lucide-react"

import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "./ui/button";
import { useUser } from "@clerk/nextjs";

export const SubscribeAction = () => {
    const { onOpen } = useModal();
    const { user } = useUser();
    if (!user) return null;
    return (
        <div>
            <ActionTooltip side="right" align="center" label={String(user?.publicMetadata.role)}>
                <Button onClick={() => onOpen("subscribe")} className="bg-transparent border-0" variant="outline" size="icon">
                    {user?.publicMetadata.role === "Subscribed" && (
                        <BadgeCheck className="group-hover:text-white transition text-emerald-500" size={25} />
                    )}
                    {user?.publicMetadata.role === "Free" && (
                        <BadgeX className="group-hover:text-white transition text-rose-500" size={25} />
                    )}
                    <span className="sr-only">Subscribe</span>
                </Button>
            </ActionTooltip>
        </div>
    )
}