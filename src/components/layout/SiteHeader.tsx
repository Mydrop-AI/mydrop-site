import { Link, NavLink } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { resolveAssetPath } from "@/lib/paths";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/pricing", label: "Pricing" },
  { to: "/blog", label: "Blog" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#111525]/82 backdrop-blur-md">
      <div className="site-container">
        <div className="flex items-center justify-between py-4">
          <Link to="/" aria-label="MydropAI home" className="inline-flex items-center">
            <img
              src={resolveAssetPath("/images/logo_regular_white.png")}
              alt="MydropAI"
              className="h-9 w-auto md:h-10"
            />
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
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

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-white/10 p-2 text-slate-200 hover:bg-white/10 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10 pb-4">
            <nav className="flex flex-col gap-3 px-2 pt-2 text-sm">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "rounded-md px-3 py-2 font-medium transition-colors",
                      isActive
                        ? "text-white bg-white/10"
                        : "text-slate-300 hover:text-white hover:bg-white/10"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-3 flex flex-col gap-2 px-2">
              <a
                href="https://app.mydropai.com/login"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-full justify-center")}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </a>
              <a
                href="https://app.mydropai.com/register"
                className={cn(buttonVariants({ size: "sm" }), "w-full justify-center")}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileOpen(false)}
              >
                Register
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
