import { Link, NavLink } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { resolveAssetPath } from "@/lib/paths";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/pricing", label: "Pricing" },
  { to: "/faq", label: "FAQ" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#111525]/82 backdrop-blur-md">
      <div className="site-container">
        <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <Link to="/" aria-label="MydropAI home" className="inline-flex items-center">
            <img
              src={resolveAssetPath("/images/logo_regular_white.png")}
              alt="MydropAI"
              className="h-9 w-auto md:h-10"
            />
          </Link>

          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "font-medium transition-colors",
                    isActive ? "text-white" : "text-slate-300 hover:text-white"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="https://app.mydropai.com/login"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
              target="_blank"
              rel="noreferrer"
            >
              Login
            </a>
            <a
              href="https://app.mydropai.com/register"
              className={buttonVariants({ size: "sm" })}
              target="_blank"
              rel="noreferrer"
            >
              Register
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
