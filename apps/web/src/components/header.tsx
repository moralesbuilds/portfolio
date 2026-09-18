"use client"

import React, { useState } from "react";
import { Link } from "@/i18n/navigation";
import { GitHubIcon, MenuIcon } from "./icons";
import { useSelectedLayoutSegments } from "next/navigation";

const COMMON_DESKTOP_STYLE = "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
const SELECTED_DESKTOP_STYLE = `border-indigo-500 text-gray-900 ${COMMON_DESKTOP_STYLE}`;
const UNSELECTED_DESKTOP_STYLE = `border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700  ${COMMON_DESKTOP_STYLE}`;

const COMMON_MOBILE_STYLE = "block pl-3 pr-4 py-2 border-l-4 font-medium";
const SELECTED_MOBILE_STYLE = `bg-indigo-50 border-indigo-500 text-indigo-700 ${COMMON_MOBILE_STYLE}`;
const UNSELECTED_MOBILE_STYLE = `border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 ${COMMON_MOBILE_STYLE}`;

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  label: string;
  selected: boolean;
};

function DesktopLink({ href, label, selected, ...rest }: LinkProps) {
  return (
    <Link
      href={href}
      className={selected ? SELECTED_DESKTOP_STYLE : UNSELECTED_DESKTOP_STYLE}
      aria-selected={selected}
      {...rest}
    >{label}</Link>
  );
}

function MobileLink({ href, label, selected, ...rest }: LinkProps) {
  return (
    <Link
      href={href}
      className={selected ? SELECTED_MOBILE_STYLE : UNSELECTED_MOBILE_STYLE}
      aria-selected={selected}
      {...rest}
    >{label}</Link>
  );
}

type HeaderProps = {
  brandLabel: string;
  blogLabel: string;
  contactLabel: string;
  openMenuLabel: string;

  githubLabel: string;
  githubUrl: string;
};

export function Header({ brandLabel, blogLabel, contactLabel, openMenuLabel, githubLabel, githubUrl }: HeaderProps) {
  const [mobileMenuOpened, setMobileMenuOpened] = useState(false);
  const onMobileMenuButtonClicked = () => setMobileMenuOpened((prevValue) => !prevValue);
  const segments = useSelectedLayoutSegments();

  const isBlogSelected = segments?.[0] === "blog";
  const isContactSelected = segments?.[0] === "contact";

  const githubLink = (
    <a
      href={githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-500 hover:text-gray-900 transition-colors"
      aria-label={githubLabel}
      data-testid="github-link"
    >
      <GitHubIcon />
    </a>
  );

  return (
    <header className="w-full">
      <nav className="bg-surface border-b border-gray-200 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Brand name */}
            <div className="shrink-0 flex items-center">
              <Link
                href="/"
                className="text-text-primary flex-none font-semibold text-xl focus:outline-hidden focus:opacity-80"
                aria-label={brandLabel}
                data-testid="brand-link"
              >{brandLabel}</Link>
            </div>

            {/* Desktop links */}
            <div className="hidden sm:flex sm:items-center sm:space-x-8">
              <div className="flex space-x-8 h-full">
                <DesktopLink href="/blog" label={blogLabel} selected={isBlogSelected} data-testid="blog-link" />
                <DesktopLink href="#" label={contactLabel} selected={isContactSelected} data-testid="contact-link" />
              </div>

              <div className="flex items-center space-x-4 border-l border-gray-200 pl-6">
                {githubLink}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="-mr-2 flex items-center sm:hidden gap-2" data-testid="mobile-panel">
              {githubLink}
              <button
                id="mobile-menu-button"
                type="button"
                onClick={onMobileMenuButtonClicked}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded={mobileMenuOpened}
                data-testid="mobile-menu"
              >
                <span className="sr-only">{openMenuLabel}</span>
                <MenuIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu links */}
        <div className={mobileMenuOpened ? 'sm:hidden' : 'hidden sm:hidden'} id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <MobileLink href="/blog" label={blogLabel} selected={isBlogSelected} data-testid="mobile-blog-link" />
            <MobileLink href="#" label={contactLabel} selected={isContactSelected} data-testid="mobile-contact-link" />
          </div>
        </div>
      </nav>
    </header>
  );
}
