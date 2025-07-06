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
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                SU
              </div>
              <span className="font-semibold">Student Union</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} 2025 FUOYE Students' Union Government (The Better Days Cabinet)

Adio Led Administration
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>for students by </span>
            </div>

            <a
              href="https://github.com/habibthadev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-4 w-4" />
              <span className="sm:inline">habibthadev</span>
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">About</h3>
              <p className="leading-relaxed">
                A secure platform for anonymous feedback and communication within our student community.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Privacy</h3>
              <p className="leading-relaxed">
                Your messages are completely anonymous. We don't track IP addresses or store any identifying
                information.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Contact</h3>
              <p className="leading-relaxed">
                For technical issues or questions, please contact the Student Union Government office.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
