"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Nickname is required."
    }),
    imageUrl: z.string(),
})

export const InitialModalNickname = () => {
    const [isMounted, setIsMounted] = useState(false);
    const { user } = useUser();

    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        // if (user) {
        //     updateUser();
        // }
    }, []);
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch("/api/profile", values);
            updateUser(values.name);
            updateMetadata();
            form.reset();

            router.refresh();
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    if(!isMounted) {
        return null;
    }

    const updateUser = async (name: string) => {
        try {
            await user?.update({
                firstName: name,
                lastName: "",
            });
        } catch (error) {
            console.error("Error updating user:", error);
            // Handle the error, e.g., show an error message to the user
        }
    };

    if (!user) return null;
    const updateMetadata = async () => {
        try {
            const response = await fetch("/api/metadata", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: user.id, roleValue: "Free" }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Successfully updated metadata", data);
                // Reload user to reflect updated metadata
                user?.reload();
                // onClose();
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
        <Dialog open>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Create your nickname
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        This is how can people identify you. You can always change it later.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({field}) =>(
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload
                                                    endpoint="serverImage"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}/>
                            </div>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Nickname
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter nickname"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant="primary" disabled={isLoading}>
                                Submit
                            </Button>
                        </DialogFooter>
                    </form>    
                </Form> 
            </DialogContent>
        </Dialog>
    )
}