import type React from "react"
import { Github, Heart } from "lucide-react"

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full">
                <img src="/images/sug-logo.jpg" alt="FUOYESUG logo" className="w-full h-full rounded-full" />
              </div>
              <span className="font-semibold">FUOYE Student Union</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} 2025 FUOYE Students' Union Government (The Better Days Cabinet).
              Adio Led Administration
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center mx-0 text-sm text-muted-foreground">
              Made with
              <Heart className="inline px-2 h-4 w-4 text-red-500 fill-current" />
              for students by             <a
              href="https://github.com/habibthadev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="inline px-2 h-4 w-4" /> habibthadev
            </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
