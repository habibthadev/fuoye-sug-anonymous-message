import type React from "react"
import { MessageSquare, CheckCircle, Clock, TrendingUp, Calendar, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { MessageStats } from "@/types"
import { cn } from "@/lib/utils"

interface StatsCardsProps {
  stats: MessageStats
  isLoading?: boolean
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, isLoading }) => {
  const cards = [
    {
      title: "Total Messages",
      value: stats.totalMessages,
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      description: "All time messages received",
    },
    {
      title: "Reviewed",
      value: stats.reviewedMessages,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      description: "Messages marked as reviewed",
    },
    {
      title: "Pending",
      value: stats.pendingMessages,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      description: "Messages awaiting review",
    },
    {
      title: "This Week",
      value: stats.messagesThisWeek,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      description: "Messages in the last 7 days",
    },
    {
      title: "This Month",
      value: stats.messagesThisMonth,
      icon: Calendar,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
      description: "Messages in the last 30 days",
    },
    {
      title: "Avg Length",
      value: stats.averageMessageLength,
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      description: "Average characters per message",
      suffix: " chars",
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-8 w-8 bg-muted rounded-full"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-2"></div>
              <div className="h-3 bg-muted rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon

        return (
          <Card
            key={card.title}
            className={cn(
              "transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
              "animate-in",
              "card-hover",
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <div className={cn("p-2 rounded-full", card.bgColor)}>
                  <Icon className={cn("h-4 w-4", card.color)} />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground">
                  {card.value.toLocaleString()}
                  {card.suffix || ""}
                </div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
