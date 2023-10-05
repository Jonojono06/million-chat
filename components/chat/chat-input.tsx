"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideWatch, Plus, Send, SendIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-modal-store";
import { EmojiPicker } from "@/components/emoji-picker";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

interface ChatInputProps {
    apiUrl: string;
    query: Record<string, any>;
    name: string;
    type: "conversation" | "channel";
}

const formSchema = z.object({
    content: z.string().min(1),
});

const ChatInput = ({
    apiUrl,
    query,
    name,
    type,
}: ChatInputProps) => {
    const { onOpen } = useModal();
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const {user} = useUser();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
        }
    });

    const isLoading = form.formState.isSubmitting;

    // const [remainingTime, setRemainingTime] = useState(() => {
    //     const lastMessageTime = localStorage.getItem('lastMessageTime');
    //     if (lastMessageTime) {
    //         const timeElapsed = Math.floor((Date.now() - Number(lastMessageTime)) / 1000);
    //         const remaining = 60 - timeElapsed;
    //         return remaining > 0 ? remaining : 0;
    //     }
    //     return 0;
    // });

    const [remainingTime, setRemainingTime] = useState<number>(0);

    useEffect(() => {
        // This ensures the code runs only on the client side
        const lastMessageTime = localStorage.getItem('lastMessageTime');
        if (lastMessageTime) {
            const timeElapsed = Math.floor((Date.now() - Number(lastMessageTime)) / 1000);
            const remaining = 60 - timeElapsed;
            setRemainingTime(remaining > 0 ? remaining : 0);
        } else {
            setRemainingTime(0);
        }
    }, []);

    const onSubmit = async (values: z.infer<typeof formSchema> = form.getValues()) => {
        if (user?.publicMetadata.role === "Free" && type === "conversation") {
            onOpen("alertModal");
            return; 
        }
        if (user?.publicMetadata.role === "Free") {
            // onOpen("alertModal");
            // return; 

            if (remainingTime > 0) {
                return;
            }

            localStorage.setItem('lastMessageTime', Date.now().toString());
            setRemainingTime(60);
            const timer = setInterval(() => {
                setRemainingTime(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }        
        try {
            const url = qs.stringifyUrl({
                url: apiUrl,
                query,
            });

            await axios.post(url, values);
            console.log(form.formState.isSubmitting); 
            form.reset();
            router.refresh();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (remainingTime > 0) {
            const timer = setInterval(() => {
                setRemainingTime(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [remainingTime]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative p-4 pb-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (user?.publicMetadata.role === "Free" && type === "conversation") {
                                                onOpen("alertModal");
                                            } else {
                                                onOpen("messageFile", { apiUrl, query });
                                            }
                                        }}
                                        className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                                    >
                                        <Plus className="text-white dark:text-[#313338]" />
                                    </button>
                                    <Input
                                        {...field}
                                        disabled={isLoading || remainingTime > 0}
                                        className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                        placeholder={`Message ${type === "conversation" ? name : "#" + name}`}
                                    />
                                    {user?.publicMetadata.role === "Free" ?(
                                    <div className="absolute right-8 flex items-center">
                                        <p className="text-xs">Slow Mode (60s)</p>
                                        <LucideWatch/>
                                    </div>
                                   ) : null}
                                    <div className="absolute top-7 right-8 flex items-center">
                                        {remainingTime > 0 && (
                                            <div className="mr-2">
                                                {remainingTime}s
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => form.handleSubmit(onSubmit)()}
                                            disabled={isLoading || remainingTime > 0}
                                            className="top-7 left-8 h-[30px] w-[30px]"
                                        >
                                            <Send />
                                        </button>
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}

export default ChatInput;
