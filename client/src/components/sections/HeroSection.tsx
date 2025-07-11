import type React from "react"
import { Link } from "react-router-dom"
import { Shield, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-40"></div>

      <div className="relative z-10 container py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="animate-in mb-8">
            <div className="flex justify-center mb-6">
               <div className="flex h-20 w-20 items-center justify-center rounded-full shadow-lg animate-pulse-green">
                  <img src="/images/sug-logo.jpg" alt="FUOYESUG logo" className="w-full h-full rounded-full" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Your Voice, <span className="text-gradient">Anonymously</span>
            </h1>
          </div>

          <div className="animate-in mb-8" style={{ animationDelay: "200ms" }}>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Share your thoughts, feedback, and concerns with the Student Union Government through our secure anonymous
              messaging platform.
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
      <div className="w-full h-fit">
        <img
          src="/images/sug-executives.jpg"
          alt="FUOYE Student Union Government executives"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  )
}
