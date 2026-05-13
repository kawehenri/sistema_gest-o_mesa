"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/cardapio", label: "Cardápio" },
  { href: "/reserva", label: "Reserva" },
  { href: "/lista-espera", label: "Lista de espera" },
  { href: "/avaliacoes", label: "Avaliações" },
  { href: "/unidades", label: "Unidades" },
  { href: "/redes", label: "Redes" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-card/95 backdrop-blur-md shadow-card border-b border-sand"
            : "bg-card/90 backdrop-blur-sm border-b border-sand/60"
        }`}
      >
        <div className="container-site">
          <div className="flex items-center justify-between h-16 lg:h-[70px]">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group"
              aria-label="Tarsila — página inicial"
            >
              <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center flex-shrink-0 group-hover:bg-brand-dark transition-colors">
                <span className="font-serif font-bold text-white text-base leading-none">
                  T
                </span>
              </div>
              <div className="leading-none">
                <p className="font-serif font-bold text-graphite text-base tracking-wide leading-none">
                  Tarsila
                </p>
                <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-graphite/50 mt-0.5">
                  Cozinha · Brasil
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav
              className="hidden lg:flex items-center gap-1"
              aria-label="Navegação principal"
            >
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active
                        ? "text-brand bg-brand/8 font-semibold"
                        : "text-graphite/70 hover:text-graphite hover:bg-ivory"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center">
              <Button href="/reserva" size="md">
                Reservar mesa
              </Button>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl hover:bg-ivory transition-colors gap-[5px]"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span
                className={`block w-5 h-0.5 bg-graphite transition-all duration-300 ${
                  menuOpen ? "rotate-45 translate-y-[7px]" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-graphite transition-all duration-300 ${
                  menuOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-graphite transition-all duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-graphite/30 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        id="mobile-menu"
        className={`fixed top-0 right-0 z-50 h-full w-[300px] bg-card shadow-card-lg transition-transform duration-300 ease-out lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex flex-col h-full pt-20 pb-8 px-6">
          <nav
            className="flex flex-col gap-1 flex-1"
            aria-label="Navegação mobile"
          >
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 ${
                    active
                      ? "text-brand bg-brand/8 font-semibold"
                      : "text-graphite hover:bg-ivory"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 pt-6 border-t border-sand">
            <Button href="/reserva" size="lg" fullWidth>
              Reservar mesa
            </Button>
            <p className="text-center text-xs text-graphite/40 mt-4">
              © 2024 Tarsila Cozinha Brasil
            </p>
          </div>
        </div>
      </div>

      {/* Spacer to push content below fixed header */}
      <div className="h-16 lg:h-[70px]" aria-hidden="true" />
    </>
  );
}
