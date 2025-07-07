import type React from "react"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import { MessageSquare, Shield, Users, Lock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAnalytics } from "@/hooks/useAnalytics"
import { cn } from "@/lib/utils"

export const HomePage: React.FC = () => {
  useAnalytics()

  useEffect(() => {
    // GSAP animations can be added here
    const elements = document.querySelectorAll(".animate-in")
    elements.forEach((el, index) => {
      el.classList.add("opacity-0")
      setTimeout(() => {
        el.classList.remove("opacity-0")
        el.classList.add("animate-fade-in")
      }, index * 100)
    })
  }, [])

  const features = [
    {
      icon: Lock,
      title: "Completely Anonymous",
      description: "No IP tracking, no user identification. Your privacy is our priority.",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      icon: MessageSquare,
      title: "Markdown Support",
      description: "Format your messages with markdown for better presentation.",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Built with security best practices and data protection in mind.",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      icon: Users,
      title: "For Students",
      description: "A dedicated channel for student voices and feedback.",
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="absolute inset-0 bg-hero-pattern opacity-40"></div>
        <div className="relative container py-24 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="animate-in mb-8">
              <div className="flex justify-center mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full">
                  <img src="/images/sug-logo.jpg" alt="FUOYESUG logo" className="w-full h-full rounded-full" />
              </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Your Voice, <span className="text-gradient">Anonymously</span>
              </h1>
            </div>

            <div className="animate-in mb-8" style={{ animationDelay: "200ms" }}>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Share your thoughts, feedback, and concerns with the FUOYE Student Union Government through our secure
                anonymous messaging platform.
              </p>
            </div>

            <div
              className="animate-in flex flex-col sm:flex-row gap-4 justify-center"
              style={{ animationDelay: "400ms" }}
            >
              <Button
                asChild
                size="lg"
                className="h-14 px-8 text-lg font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Link to="/message" className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Send Anonymous Message
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg font-medium border-2 hover:bg-primary/5 transition-all duration-200 bg-transparent"
              >
                <Link to="/admin/login" className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Admin Access
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Why Choose This Platform?
            </h2>
            <p className="text-lg text-muted-foreground">Built with privacy, security, and user experience in mind.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon

              return (
                <Card
                  key={feature.title}
                  className={cn(
                    "text-center border-0 shadow-lg card-hover animate-in",
                    "bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50",
                  )}
                  style={{ animationDelay: `${600 + index * 100}ms` }}
                >
                  <CardHeader className="pb-4">
                    <div className={cn("mx-auto p-3 rounded-full w-fit mb-4", feature.bgColor)}>
                      <Icon className={cn("h-8 w-8", feature.color)} />
                    </div>
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">
              Simple, secure, and anonymous messaging in three easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Write Your Message",
                description: "Compose your message using our markdown-supported editor with live preview.",
                icon: MessageSquare,
              },
              {
                step: "02",
                title: "Submit Anonymously",
                description: "Send your message without any personal information or tracking.",
                icon: Send,
              },
              {
                step: "03",
                title: "Reach Student Union",
                description: "Your message is delivered securely to the Student Union Government.",
                icon: Users,
              },
            ].map((item, index) => {
              const Icon = item.icon

              return (
                <div
                  key={item.step}
                  className={cn("text-center animate-in")}
                  style={{ animationDelay: `${1000 + index * 200}ms` }}
                >
                  <div className="relative mb-6">
                    <div className="mx-auto w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                      {item.step}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>

                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary to-primary/80">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl mb-4">
              Ready to Share Your Voice?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Join the conversation and help improve our student community.
            </p>

            <Button
              asChild
              size="lg"
              variant="secondary"
              className="h-14 px-8 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Link to="/message" className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Start Messaging Now
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
