import { ReactNode } from "react";
import { Link } from "react-router-dom";
import aureaVoxLogo from "@/assets/aurea-vox.png";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img 
                  src={aureaVoxLogo} 
                  alt="AureaVox Logo" 
                  className="w-8 h-8 object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                AureaVox
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
