import { Navigate, type RouteObject, useRoutes } from "react-router-dom";
import SiteLayout from "@/components/layout/SiteLayout";
import AuthorPage from "@/pages/AuthorPage";
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import ContactPage from "@/pages/ContactPage";
import FAQPage from "@/pages/FAQPage";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import PricingPage from "@/pages/PricingPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsAndServicesPage from "@/pages/TermsAndServicesPage";

const routes: RouteObject[] = [
  {
    element: <SiteLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "pricing", element: <PricingPage /> },
      { path: "blog", element: <BlogPage /> },
      { path: "authors/:slug", element: <AuthorPage /> },
      { path: "post/:slug", element: <BlogPostPage /> },
      { path: "privacy-policy", element: <PrivacyPolicyPage /> },
      { path: "terms-and-services", element: <TermsAndServicesPage /> },
      { path: "faq", element: <FAQPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "fr/*", element: <Navigate to="/" replace /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];

export default function AppRoutes() {
  return useRoutes(routes);
}
