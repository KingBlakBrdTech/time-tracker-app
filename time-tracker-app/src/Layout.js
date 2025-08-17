import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Clock, Calendar, LogOut, Shield } from "lucide-react";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);

  const navigationItems = [
    {
      title: "Clock In/Out",
      url: createPageUrl("Dashboard"),
      icon: Clock,
    },
    {
      title: "Timesheet",
      url: createPageUrl("Timesheet"),
      icon: Calendar,
    },
    ...(user?.role === 'admin' ? [{
      title: "Admin Dashboard",
      url: createPageUrl("AdminDashboard"),
      icon: Shield,
    }] : [])
  ];

  useEffect(() => {
    if (currentPageName) {
      document.title = `${currentPageName} - AQI Time Tracker`;
    } else {
      document.title = 'AQI Time Tracker';
    }

    const updateMeta = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`) || 
                 document.querySelector(`meta[name="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(property.includes(':') ? 'property' : 'name', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMeta('og:title', 'AQI Time Tracker');
    updateMeta('og:description', 'Professional time tracking system for Al-Noor Quranic Institute');
    updateMeta('og:image', '/logo512.png'); // Replaced with local AQIlogo.jpg
    updateMeta('og:url', window.location.href);
    updateMeta('og:type', 'website');

    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', 'AQI Time Tracker');
    updateMeta('twitter:description', 'Professional time tracking system for Al-Noor Quranic Institute');
    updateMeta('twitter:image', '/logo512.png'); // Replaced with local AQIlogo.jpg

    updateMeta('application-name', 'AQI Time Tracker');
    updateMeta('apple-mobile-web-app-title', 'AQI Time Tracker');
    updateMeta('theme-color', '#1B447E');
    updateMeta('msapplication-TileColor', '#1B447E');

    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.setAttribute('rel', 'icon');
      document.head.appendChild(favicon);
    }
    favicon.setAttribute('href', '/favicon.ico'); // Replaced with local icon.png

    const manifestData = {
      name: "AQI Time Tracker",
      short_name: "AQI Tracker",
      description: "Professional time tracking system for Al-Noor Quranic Institute",
      start_url: "/",
      display: "standalone",
      background_color: "#FFFFFF",
      theme_color: "#1B447E",
      icons: [
        {
          src: "/favicon.ico", // Replaced with local icon.png
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/logo512.png", // Replaced with local AQIlogo.jpg
          sizes: "512x512",
          type: "image/png"
        }
      ]
    };

    const manifestBlob = new Blob([JSON.stringify(manifestData)], { type: 'application/json' });
    const manifestUrl = URL.createObjectURL(manifestBlob);

    let manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.setAttribute('rel', 'manifest');
      document.head.appendChild(manifestLink);
    }
    manifestLink.setAttribute('href', manifestUrl);

  }, [currentPageName]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
      } catch (e) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await User.logout();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        body {
          background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #7c3aed 100%);
          min-height: 100vh;
          margin: 0;
        }
      `}</style>
      
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <Sidebar className="bg-slate-900/95 backdrop-blur-sm border-r border-slate-700/50">
            <SidebarHeader className="border-b border-slate-700/50 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                  <img 
                    src="/favicon.ico" // Replaced with local icon.png
                    alt="AQI Logo" 
                    className="w-6 h-6" 
                  />
                </div>
                <div>
                  <h2 className="font-semibold text-white text-sm">AQI Time Tracker</h2>
                  <p className="text-xs text-slate-400">Al-Noor Institute</p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-4">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-2">
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`rounded-xl h-11 transition-all duration-200 ${
                            location.pathname === item.url 
                              ? 'bg-blue-600 text-white shadow-lg' 
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-3 font-medium text-sm">
                            <item.icon className="w-4 h-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-slate-700/50">
              {user ? (
                <div className="flex items-center justify-between bg-slate-800 rounded-xl p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                      <span className="font-medium text-white text-xs">
                        {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white text-xs truncate">{user.full_name}</p>
                        {user.role === 'admin' && (
                          <Shield className="w-3 h-3 text-amber-400" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleLogout} 
                    className="text-slate-400 hover:text-white hover:bg-slate-700 h-8 w-8 shrink-0 rounded-lg"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="h-12 animate-pulse bg-slate-800 rounded-xl"></div>
              )}
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 flex flex-col bg-slate-50">
            <header className="bg-white border-b border-slate-200 px-6 py-4 md:hidden">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-colors" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <img 
                      src="/favicon.ico" // Replaced with local icon.png
                      alt="AQI Logo" 
                      className="w-5 h-5" 
                    />
                  </div>
                  <h1 className="text-xl font-semibold text-slate-900">AQI Time Tracker</h1>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </>
  );
}