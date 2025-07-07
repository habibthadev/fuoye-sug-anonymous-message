import type React from "react"
import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { MessageSquare, BarChart3, Settings, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatsCards } from "@/components/admin/StatsCards"
import { MessageCard } from "@/components/admin/MessageCard"
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts"
import { apiService } from "@/services/api"
import { useAuthStore } from "@/stores/authStore"
import { toast } from "sonner"
import type { Message } from "@/types"

export const DashboardPage: React.FC = () => {
  const { admin } = useAuthStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [currentPage] = useState(1)
  const [filter, setFilter] = useState<"all" | "reviewed" | "pending">("all")

  // Fetch messages
  const {
    data: messagesData,
    isLoading: messagesLoading,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ["messages", currentPage],
    queryFn: () => apiService.getMessages(currentPage, 10),
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  // Fetch message stats
  const {
    data: statsData,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["message-stats"],
    queryFn: () => apiService.getMessageStats(),
    refetchInterval: 60000, // Refetch every minute
  })

  // Fetch analytics
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: ["analytics"],
    queryFn: () => apiService.getAnalytics(),
    refetchInterval: 300000, // Refetch every 5 minutes
  })

  useEffect(() => {
    if (messagesData?.success && messagesData.data) {
      setMessages(messagesData.data.messages)
    }
  }, [messagesData])

  const handleMessageUpdate = (id: string, updates: Partial<Message>) => {
    setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg)))
    refetchStats()
  }

  const handleMessageDelete = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id))
    refetchStats()
  }

  const handleRefreshAll = () => {
    Promise.all([refetchMessages(), refetchStats(), refetchAnalytics()])
      .then(() => {
        toast.success("Data refreshed successfully")
      })
      .catch(() => {
        toast.error("Failed to refresh data")
      })
  }

  const filteredMessages = messages.filter((message) => {
    if (filter === "reviewed") return message.isReviewed
    if (filter === "pending") return !message.isReviewed
    return true
  })

  const stats: any = statsData?.success
    ? statsData.data
    : {
        totalMessages: 0,
        reviewedMessages: 0,
        pendingMessages: 0,
        messagesThisWeek: 0,
        messagesThisMonth: 0,
        averageMessageLength: 0,
      }

  const analytics: any = analyticsData?.success
    ? analyticsData.data
    : {
        dailyAnalytics: [],
        totalStats: {
          totalPageViews: 0,
          totalUniqueVisitors: 0,
          totalMessageSubmissions: 0,
          totalAdminLogins: 0,
          averageBounceRate: 0,
          averageSessionDuration: 0,
        },
      }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {admin?.email}</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshAll}
              className="flex items-center gap-2 bg-transparent"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCards stats={stats} isLoading={statsLoading} />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="messages" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Recent Messages
                    </CardTitle>
                    <CardDescription>Manage and review anonymous messages from students</CardDescription>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={filter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("all")}
                    >
                      All ({stats.totalMessages})
                    </Button>
                    <Button
                      variant={filter === "pending" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("pending")}
                    >
                      Pending ({stats.pendingMessages})
                    </Button>
                    <Button
                      variant={filter === "reviewed" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("reviewed")}
                    >
                      Reviewed ({stats.reviewedMessages})
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {messagesLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="h-32 bg-muted rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredMessages.length > 0 ? (
                  <div className="space-y-2 md:space-y-6">
                    {filteredMessages.map((message) => (
                      <MessageCard
                        key={message.id}
                        message={message}
                        onUpdate={handleMessageUpdate}
                        onDelete={handleMessageDelete}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No messages found</h3>
                    <p className="text-muted-foreground">
                      {filter === "all" ? "No messages have been submitted yet." : `No ${filter} messages found.`}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Platform Analytics
                </CardTitle>
                <CardDescription>Track platform usage, engagement, and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsCharts data={analytics} isLoading={analyticsLoading} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Platform Settings
                </CardTitle>
                <CardDescription>Configure platform settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center py-12">
                    <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Settings Panel</h3>
                    <p className="text-muted-foreground">Platform configuration options will be available here.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
