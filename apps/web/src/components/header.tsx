"use client"

import { useState } from "react";
import { Link } from "../i18n/navigation";
import ExternalLink from "./external_link";
import { GitHubIcon, MenuIcon } from "./icons";

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

  return (
    <header>
      <nav className="bg-surface border-b border-gray-200 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Brand name */}
            <div className="shrink-0 flex items-center">
              <Link className="text-text-primary flex-none font-semibold text-xl focus:outline-hidden focus:opacity-80" href="#" aria-label={brandLabel}>{brandLabel}</Link>
            </div>

            {/* Desktop links */}
            <div className="hidden sm:flex sm:items-center sm:space-x-8">
              <div className="flex space-x-8 h-full">
                <Link href="#" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">{blogLabel}</Link>
                <Link href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">{contactLabel}</Link>
              </div>

              <div className="flex items-center space-x-4 border-l border-gray-200 pl-6">
                <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors" aria-label={githubLabel}>
                  <GitHubIcon />
                </a>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="-mr-2 flex items-center sm:hidden">
              <button id="mobile-menu-button" type="button" onClick={onMobileMenuButtonClicked} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none" aria-controls="mobile-menu" aria-expanded="false">
                <span className="sr-only">{openMenuLabel}</span>
                <MenuIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu links */}
        <div className={mobileMenuOpened ? 'sm:hidden' : 'hidden sm:hidden'} id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="#" className="bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 font-medium">{blogLabel}</Link>
            <Link href="#" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 font-medium">{contactLabel}</Link>
          </div>

          <div className="pt-4 pb-3 border-t border-gray-200 px-4">
            <ExternalLink href={githubUrl} label={githubLabel} icon={<GitHubIcon />} />
          </div>
        </div>
      </nav>
    </header>
  );
}
