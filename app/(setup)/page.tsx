import { redirect } from "next/navigation";
import { db } from "@/lib/db"
import { initialProfile } from "@/lib/initial-profile";
import { InitialModal } from "@/components/modals/initial-modal";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";

const SetupPage = async () => {
    const profile = await initialProfile()

    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if(server){
        return redirect(`/servers/${server.id}`);
    }

    // if(!server){
    //     return redirect("/servers");
    // }

    return <InitialModal/>
    // return <NavigationSidebar/>
}
 
export default SetupPage; 