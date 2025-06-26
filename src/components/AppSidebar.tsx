
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, Heart, Brain, Users, Bot, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Health",
    url: "/health",
    icon: Heart,
  },
  {
    title: "Mental",
    url: "/mental", 
    icon: Brain,
  },
  {
    title: "Community",
    url: "/community",
    icon: Users,
  },
  {
    title: "AI Chatbot",
    url: "/ai-chatbot",
    icon: Bot,
    badge: "In Beta"
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();
  
  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarContent className="bg-gray-50">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity">
            <img 
              src="/lovable-uploads/91d2546c-bdfa-484f-989a-fb228fba05f8.png" 
              alt="WellNest Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="text-xl font-bold text-primary font-poppins">WellNest</span>
          </Link>
          
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`w-full justify-start p-3 rounded-lg font-poppins transition-colors ${
                          isActive 
                            ? 'bg-teal-100 text-teal-700 font-medium' 
                            : 'hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <Badge 
                              variant="secondary" 
                              className="bg-orange-100 text-orange-600 border-orange-200 font-poppins text-xs px-2 py-0.5 ml-2"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
