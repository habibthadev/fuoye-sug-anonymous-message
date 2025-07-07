import type React from "react"
import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Home, MessageSquare, ArrowLeft, Search, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Add animation classes after component mounts
    const elements = document.querySelectorAll(".animate-in")
    elements.forEach((el, index) => {
      el.classList.add("opacity-0")
      setTimeout(() => {
        el.classList.remove("opacity-0")
        el.classList.add("animate-fade-in")
      }, index * 100)
    })
  }, [])

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate("/")
    }
  }

  const quickLinks = [
    {
      title: "Home",
      description: "Return to the main page",
      href: "/",
      icon: Home,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Send Message",
      description: "Share your thoughts anonymously",
      href: "/message",
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Admin Login",
      description: "Access the admin dashboard",
      href: "/admin/login",
      icon: Search,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4 mt-8">
      <div className="w-full max-w-4xl mx-auto">
        {/* Main 404 Content */}
        <div className="text-center mb-12">
          <div className="animate-in mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 text-red-600 dark:text-red-400 text-6xl font-bold shadow-lg">
                  404
                </div>
                <div className="absolute -top-2 -right-2 h-12 w-12 bg-red-500/20 rounded-full flex items-center justify-center animate-bounce">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl mb-4">
              Page Not <span className="text-gradient">Found</span>
            </h1>
          </div>

          <div className="animate-in mb-8" style={{ animationDelay: "200ms" }}>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-6">
              Oops! The page you're looking for seems to have wandered off. Don't worry, it happens to the best of us.
            </p>
            <p className="text-lg text-muted-foreground">
              Let's get you back on track with the Student Union Anonymous Messaging platform.
            </p>
          </div>

          <div
            className="animate-in flex flex-col sm:flex-row gap-4 justify-center mb-12"
            style={{ animationDelay: "400ms" }}
          >
            <Button
              onClick={handleGoBack}
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg font-medium border-2 hover:bg-primary/5 transition-all duration-200 bg-transparent"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </Button>

            <Button
              asChild
              size="lg"
              className="h-14 px-8 text-lg font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Go Home
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="animate-in" style={{ animationDelay: "600ms" }}>
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold">Where would you like to go?</CardTitle>
              <CardDescription className="text-base">
                Here are some popular destinations on our platform
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickLinks.map((link, index) => {
                  const Icon = link.icon

                  return (
                    <Link
                      key={link.title}
                      to={link.href}
                      className={cn(
                        "group block p-6 rounded-lg border border-border hover:border-primary/30",
                        "bg-gradient-to-br from-background to-muted/30",
                        "hover:shadow-lg hover:-translate-y-1 transition-all duration-200",
                        "animate-in card-hover",
                      )}
                      style={{ animationDelay: `${800 + index * 100}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn("p-3 rounded-full", link.bgColor)}>
                          <Icon className={cn("h-6 w-6", link.color)} />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                            {link.title}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">{link.description}</p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <div className="animate-in mt-12 text-center" style={{ animationDelay: "1000ms" }}>
          <div className="p-6 bg-primary/5 rounded-lg border border-primary/10 max-w-2xl mx-auto">
            <h3 className="font-semibold text-primary mb-2">Still can't find what you're looking for?</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              If you believe this is an error or you were expecting to find something here, please contact the Student
              Union Government office for assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm text-muted-foreground">
              <span>URL you tried to access:</span>
              <code className="bg-muted px-2 py-1 rounded text-xs font-mono break-all">{window.location.pathname}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
