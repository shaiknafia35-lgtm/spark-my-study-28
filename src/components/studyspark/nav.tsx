import { Link } from "@tanstack/react-router";
import { Logo } from "./brand";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";

const links = [
  { label: "Home", href: "/#home" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Features", href: "/#features" },
  { label: "About", href: "/#about" },
];

export function SiteNav({ dashboard = false }: { dashboard?: boolean }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo compact={dashboard} />
        {!dashboard && (
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          {dashboard ? (
            <Button asChild variant="outline" size="sm">
              <Link to="/">New PDF</Link>
            </Button>
          ) : (
            <Button asChild size="sm" className="bg-gradient-spark text-primary-foreground">
              <a href="#upload">Upload PDF</a>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
