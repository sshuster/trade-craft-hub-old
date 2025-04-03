
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="pattern"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M50 0 L100 50 L50 100 L0 50 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern)" />
        </svg>
      </div>

      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                Buy, Sell, Trade<br />
                <span className="text-primary">Without Limits</span>
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Connect with individuals and businesses around you. Find exactly what you need or sell items you no longer use.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" onClick={() => navigate("/browse")}>
                Browse Items
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/register")}>
                Create Account
              </Button>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <span className="font-medium text-foreground">10K+</span>
                <span>Active Users</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-muted-foreground"></div>
              <div className="flex items-center space-x-1">
                <span className="font-medium text-foreground">50K+</span>
                <span>Listed Items</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-muted-foreground"></div>
              <div className="flex items-center space-x-1">
                <span className="font-medium text-foreground">9.8/10</span>
                <span>User Rating</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px] aspect-square">
              <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-secondary/20 rounded-lg -z-10 transform translate-x-4 -translate-y-4"></div>
              <div className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-primary/20 rounded-lg -z-10 transform -translate-x-4 translate-y-4"></div>
              <div className="w-full h-full rounded-lg overflow-hidden border shadow-lg">
                <img
                  src="/placeholder.svg"
                  alt="Marketplace Illustration"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
