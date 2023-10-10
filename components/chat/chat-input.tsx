"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideWatch, Plus, Send, SendHorizonal, SendIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-modal-store";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Member, Profile } from "@prisma/client";

interface ChatInputProps {
    apiUrl: string;
    query: Record<string, any>;
    name: string;
    type: "conversation" | "channel";
    otherMemberId: string;
}

const formSchema = z.object({
    content: z.string().min(1),
});

const ChatInput = ({
    apiUrl,
    query,
    name,
    type,
    otherMemberId,
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
            await axios.post('/api/push/notify', {
                message: values.content,
                recipientId: otherMemberId
            });

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
                                        <Plus className="text-white dark:text-[#2E2B2B]" />
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
                                    <div className="absolute top-7 right-8 h-[24px] flex items-center">
                                        {remainingTime > 0 && (
                                            <div className="mr-2text-zinc-500 dark:text-zinc-400">
                                                {remainingTime}s
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => form.handleSubmit(onSubmit)()}
                                            disabled={isLoading || remainingTime > 0}
                                            className="h-[30px] w-[30px] flex items-center justify-center"
                                        >
                                            <SendHorizonal className="h-7 w-8 hover:opacity-75 transition text-zinc-500 dark:text-zinc-400" />
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