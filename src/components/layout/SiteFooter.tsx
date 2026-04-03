import { Link } from "react-router-dom";
import { resolveAssetPath } from "@/lib/paths";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0f1322]/72">
      <div className="site-container py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <img
              src={resolveAssetPath("/images/logo_regular_white.png")}
              alt="MydropAI"
              className="h-9 w-auto"
            />
            <p className="max-w-sm text-sm text-slate-300">
              The social operating system for brands, agencies, and teams managing many profiles with one strategy.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-300">
            <Link to="/pricing" className="hover:text-white">
              Pricing
            </Link>
            <Link to="/blog" className="hover:text-white">
              Blog
            </Link>
            <Link to="/faq" className="hover:text-white">
              FAQ
            </Link>
            <Link to="/contact" className="hover:text-white">
              Contact
            </Link>
            <Link to="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms-and-services" className="hover:text-white">
              Terms & Services
            </Link>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-400">
          © {new Date().getFullYear()} MydropAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
