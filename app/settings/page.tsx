
import SideBar from "@/component/SideBar";
import { getCurrentUser } from "@/lib/auth";
import { AccountSettings } from "@stackframe/stack";

export default async function SettingsPage() {
    const user = await getCurrentUser();

    return (
       <div className="min-h-screen bg-gray-50">
               <SideBar currentPath="/settings"/>

               <main className="ml-50 p-8">
                    <div className="mb-8">
                       <div className="flex items-center justify-between ">
                           <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
                               <p className="text-gray-500 text-sm">Menage Your account Settings and prefrences</p>
                           </div>
                       </div>
                </div>
                <div className="max-w-6xl overflow-y-auto ">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <AccountSettings fullPage/>

                </div>
            </div>

            </main>

            </div>
    )
}
