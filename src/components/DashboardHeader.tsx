
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProfileDropdown } from "./ProfileDropdown";

export function DashboardHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search for anything"
              className="pl-10 bg-gray-100 border-0 rounded-full font-poppins"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
          </div>
          
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
