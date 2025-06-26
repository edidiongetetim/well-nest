
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatePostBox } from "@/components/community/CreatePostBox";
import { EnhancedCommunityFeed } from "@/components/community/EnhancedCommunityFeed";
import { CommunitySearch } from "@/components/CommunitySearch";
import { TrendingSection } from "@/components/community/TrendingSection";

const Community = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePostCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-purple-50 via-white to-mint-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                  {/* Header */}
                  <div className="mb-6">
                    <h1 className="font-poppins font-bold text-3xl text-primary mb-2">
                      Community
                    </h1>
                    <p className="font-poppins text-gray-600">
                      Connect with other moms and share your journey together
                    </p>
                  </div>

                  {/* Create Post Box */}
                  <CreatePostBox onPostCreated={handlePostCreated} />

                  {/* Tabs and Search */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <Tabs defaultValue="suggested" className="w-full">
                      <div className="flex items-center justify-between mb-4">
                        <TabsList className="grid w-full max-w-md grid-cols-3 bg-gray-100">
                          <TabsTrigger value="suggested" className="font-poppins text-sm">
                            Suggested
                          </TabsTrigger>
                          <TabsTrigger value="following" className="font-poppins text-sm">
                            Following
                          </TabsTrigger>
                          <TabsTrigger value="new" className="font-poppins text-sm">
                            New
                          </TabsTrigger>
                        </TabsList>
                        
                        <CommunitySearch />
                      </div>

                      <TabsContent value="suggested" className="mt-0">
                        <EnhancedCommunityFeed feedType="suggested" refreshTrigger={refreshTrigger} />
                      </TabsContent>
                      
                      <TabsContent value="following" className="mt-0">
                        <EnhancedCommunityFeed feedType="following" refreshTrigger={refreshTrigger} />
                      </TabsContent>
                      
                      <TabsContent value="new" className="mt-0">
                        <EnhancedCommunityFeed feedType="new" refreshTrigger={refreshTrigger} />
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-6">
                    <TrendingSection />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Community;
