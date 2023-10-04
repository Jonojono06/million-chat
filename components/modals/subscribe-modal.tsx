"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { useUser } from "@clerk/nextjs";

export const SubscribeModal = () => {
    
    const { isOpen, onClose, type, data } = useModal();

    const router = useRouter();

    const isModalOpen = isOpen && type === "subscribe";
    const { server } = data;
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            await axios.delete(``);

            onClose();
            router.refresh();
            router.push("/");
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const { user } = useUser();
    if (!user) return null;
    const updateUser = async () => {
        try {
            const response = await fetch("/api/metadata", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: user.id, roleValue: "Subscribed" }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Successfully updated metadata", data);
                // Reload user to reflect updated metadata
                user.reload();
                onClose();
                router.refresh();
                // router.push("/");
            } else {
                user.reload();
                const data = await response.json();
                // onClose();
                // router.refresh();
                // router.push("/");
                console.error("Error updating metadata:", data.message);
            }
        } catch (error) {
            // onClose();
            // router.refresh();
            // // router.push("/");
            // user.reload();
            console.log(error);
        }

    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Subscribe to Premium
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button disabled={isLoading} onClick={onClose} variant="ghost">
                            Cancel
                        </Button>
                        <Button disabled={isLoading} variant="primary" onClick={updateUser}>
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}