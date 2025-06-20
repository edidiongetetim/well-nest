
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommunityFeed } from "@/components/CommunityFeed";
import { CommunitySearch } from "@/components/CommunitySearch";
import { WellnessCards } from "@/components/WellnessCards";

const Community = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Header */}
              <div className="mb-6">
                <h1 className="font-poppins font-bold text-3xl text-primary mb-2">
                  Community
                </h1>
                <p className="font-poppins text-gray-600">
                  Connect with other moms and share your journey
                </p>
              </div>

              {/* Tabs and Search */}
              <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <Tabs defaultValue="suggested" className="flex-1">
                  <div className="flex items-center justify-between">
                    <TabsList className="grid w-full max-w-md grid-cols-3">
                      <TabsTrigger value="suggested" className="font-poppins">Suggested</TabsTrigger>
                      <TabsTrigger value="following" className="font-poppins">Following</TabsTrigger>
                      <TabsTrigger value="new" className="font-poppins">New</TabsTrigger>
                    </TabsList>
                    
                    <CommunitySearch />
                  </div>

                  <TabsContent value="suggested" className="mt-6">
                    <CommunityFeed feedType="suggested" />
                  </TabsContent>
                  
                  <TabsContent value="following" className="mt-6">
                    <CommunityFeed feedType="following" />
                  </TabsContent>
                  
                  <TabsContent value="new" className="mt-6">
                    <CommunityFeed feedType="new" />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Wellness Content Cards */}
              <WellnessCards />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Community;
