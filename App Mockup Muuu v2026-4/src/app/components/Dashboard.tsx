import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { Badge } from "./ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import { Separator } from "./ui/separator";
import {
  BarChart3,
  Users,
  Settings,
  Home,
  TrendingUp,
  DollarSign,
  Activity,
  Menu,
  Bell,
  Search,
} from "lucide-react";
import { OverviewChart } from "./OverviewChart";
import { UserManagement } from "./UserManagement";
import { SettingsPanel } from "./SettingsPanel";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1% from last month",
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Active Users",
      value: "2,350",
      change: "+180.1% from last month",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Conversion Rate",
      value: "12.5%",
      change: "+19% from last month",
      icon: TrendingUp,
      color: "text-orange-500",
    },
    {
      title: "Active Sessions",
      value: "573",
      change: "+201 since last hour",
      icon: Activity,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`bg-card border-r transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"}`}
      >
        <div className="p-4">
          <div className="flex items-center gap-2">
            {sidebarOpen && (
              <h2 className="font-semibold">Dashboard</h2>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="ml-auto"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <nav className="px-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={
                  activeTab === item.id ? "secondary" : "ghost"
                }
                className={`w-full justify-start mb-1 ${!sidebarOpen && "px-2"}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className="h-4 w-4" />
                {sidebarOpen && (
                  <span className="ml-2">{item.label}</span>
                )}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold capitalize">
                {activeTab}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={index}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {stat.title}
                        </CardTitle>
                        <Icon
                          className={`h-4 w-4 ${stat.color}`}
                        />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {stat.value}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {stat.change}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Charts and Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                    <CardDescription>
                      Revenue and user growth over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <OverviewChart />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        user: "John Doe",
                        action: "signed up",
                        time: "2 hours ago",
                      },
                      {
                        user: "Jane Smith",
                        action: "made a purchase",
                        time: "4 hours ago",
                      },
                      {
                        user: "Bob Johnson",
                        action: "updated profile",
                        time: "6 hours ago",
                      },
                      {
                        user: "Alice Brown",
                        action: "left a review",
                        time: "8 hours ago",
                      },
                    ].map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {activity.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm">
                            {activity.user} {activity.action}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <Tabs
                defaultValue="overview"
                className="space-y-4"
              >
                <TabsList>
                  <TabsTrigger value="overview">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="sales">Sales</TabsTrigger>
                  <TabsTrigger value="traffic">
                    Traffic
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="overview"
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Revenue Analytics</CardTitle>
                        <CardDescription>
                          Monthly revenue breakdown
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <OverviewChart />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          Top Performing Pages
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {[
                          {
                            page: "/dashboard",
                            views: "12,543",
                            bounce: "23%",
                          },
                          {
                            page: "/products",
                            views: "8,932",
                            bounce: "31%",
                          },
                          {
                            page: "/pricing",
                            views: "6,421",
                            bounce: "18%",
                          },
                          {
                            page: "/about",
                            views: "3,210",
                            bounce: "45%",
                          },
                        ].map((page, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <p className="font-medium">
                                {page.page}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {page.views} views
                              </p>
                            </div>
                            <Badge variant="secondary">
                              {page.bounce} bounce rate
                            </Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="sales">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sales Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Sales analytics would be displayed here.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="traffic">
                  <Card>
                    <CardHeader>
                      <CardTitle>Traffic Sources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Traffic analytics would be displayed
                        here.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {activeTab === "users" && <UserManagement />}
          {activeTab === "settings" && <SettingsPanel />}
        </main>
      </div>
    </div>
  );
}