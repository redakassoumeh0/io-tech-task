"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, Search as SearchIcon } from "lucide-react";
import LocaleSwitcher from "./LocaleSwitcher";
import { useTranslations } from "next-intl";

function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="h-8 w-8 rounded bg-brand-lighter" />
      <span className="text-sm tracking-wide text-white/90">IO TECH</span>
    </Link>
  );
}

function BookButton() {
  const t = useTranslations("navbar");
  return (
    <Link
      href="#book"
      className="rounded border border-white/60 px-3 py-1.5 text-xs text-white/90 hover:bg-white/10 transition"
    >
      {t("book")}
    </Link>
  );
}

function ServicesDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("navbar");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const servicesList = t.raw("servicesList") as string[];

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 text-white/80 hover:text-white transition"
      >
        {t("services")}
        <ChevronDown
          size={14}
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-[30px] mt-2 grid grid-cols-3 gap-x-10 gap-y-2 rounded-b bg-brand-dark/95 p-6 shadow-lg min-w-[720px] z-30">
          {servicesList.map((item, idx) => (
            <Link
              key={idx}
              href="/services"
              className="text-sm text-white/80 hover:text-white"
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function NavLinks() {
  const t = useTranslations("navbar");
  return (
    <div className="hidden md:flex items-center gap-6 text-sm">
      <Link href="#" className="text-white/80 hover:text-white">
        {t("about")}
      </Link>
      <ServicesDropdown />
      <Link href="#" className="text-white/80 hover:text-white">
        {t("ourTeam")}
      </Link>
      <Link href="#" className="text-white/80 hover:text-white">
        {t("blogs")}
      </Link>
      <Link href="#" className="text-white/80 hover:text-white">
        {t("contact")}
      </Link>
    </div>
  );
}

function SearchToggle({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const t = useTranslations("navbar");

  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [setOpen]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="p-1 text-white/85 hover:text-white transition"
        aria-label={t("searchOpen")}
      >
        <SearchIcon size={18} />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="rounded border border-white/60 bg-transparent px-3 py-1 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-1 focus:ring-white/80 transition-all w-32 sm:w-52"
      />
      <button
        onClick={() => setOpen(false)}
        className="p-1 text-white/85 hover:text-white transition"
        aria-label={t("close")}
      >
        <X size={18} />
      </button>
    </div>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [servicesOpen, setServicesOpen] = useState(false);
  const t = useTranslations("navbar");
  const servicesList = t.raw("servicesList") as string[];

  if (!open) return null;
  return (
    <div className="md:hidden bg-brand-medium px-4 py-4 space-y-3 border-t border-white/10">
      <Link href="#" className="block text-white/90">
        {t("home")}
      </Link>
      <Link href="#" className="block text-white/80 hover:text-white">
        {t("about")}
      </Link>

      <button
        onClick={() => setServicesOpen((s) => !s)}
        className="flex w-full items-center justify-between text-white/80 hover:text-white"
      >
        <span>{t("services")}</span>
        <ChevronDown
          className={`transition ${servicesOpen ? "rotate-180" : ""}`}
          size={16}
        />
      </button>
      {servicesOpen && (
        <div className="grid grid-cols-1 gap-2 pl-3">
          {servicesList.map((item, idx) => (
            <Link
              key={idx}
              href="#"
              className="text-sm text-white/80 hover:text-white"
            >
              {item}
            </Link>
          ))}
        </div>
      )}

      <Link href="#" className="block text-white/80 hover:text-white">
        {t("ourTeam")}
      </Link>
      <Link href="#" className="block text-white/80 hover:text-white">
        {t("blogs")}
      </Link>
      <Link href="#" className="block text-white/80 hover:text-white">
        {t("contact")}
      </Link>

      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
        <LocaleSwitcher />
        <BookButton />
      </div>

      <button
        onClick={onClose}
        className="mt-2 inline-flex items-center gap-1 text-white/70"
      >
        <X size={18} /> {t("close")}
      </button>
    </div>
  );
}

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-brand-dark/95 backdrop-blur"
          : "bg-transparent backdrop-blur-0"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <BrandLogo />

        <NavLinks />

        <div className="flex items-center gap-3">
          <SearchToggle open={searchOpen} setOpen={setSearchOpen} />

          {!searchOpen && (
            <>
              <LocaleSwitcher />
              <BookButton />
            </>
          )}

          <button
            className="md:hidden p-1 text-white/85 hover:text-white"
            onClick={() => setMobileOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </nav>
  );
};

export default Navbar;
