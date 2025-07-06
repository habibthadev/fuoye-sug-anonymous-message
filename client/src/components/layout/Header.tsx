import type React from "react"
import { Link, useLocation } from "react-router-dom"
import { Moon, Sun, MessageSquare, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useThemeStore } from "@/stores/themeStore"
import { useAuthStore } from "@/stores/authStore"
import { cn } from "@/lib/utils"

export const Header: React.FC = () => {
  const location = useLocation()
  const { theme, toggleTheme } = useThemeStore()
  const { isAuthenticated, logout } = useAuthStore()

  const isAdminRoute = location.pathname.startsWith("/admin")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
            SU
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-foreground">Student Union</h1>
            <p className="text-xs text-muted-foreground">Anonymous Messaging</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === "/" ? "text-primary" : "text-muted-foreground",
            )}
          >
            Home
          </Link>
          <Link
            to="/message"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
              location.pathname === "/message" ? "text-primary" : "text-muted-foreground",
            )}
          >
            <MessageSquare className="h-4 w-4" />
            Send Message
          </Link>
          {!isAdminRoute && (
            <Link
              to="/admin/login"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
                location.pathname === "/admin/login" ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4" />
            <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} aria-label="Toggle theme" />
            <Moon className="h-4 w-4" />
          </div>

          {/* Admin logout */}
          {isAuthenticated && isAdminRoute && (
            <Button variant="outline" size="sm" onClick={logout} className="hidden sm:flex bg-transparent">
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
