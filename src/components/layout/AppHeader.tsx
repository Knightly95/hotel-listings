import React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

import { locales } from '@/src/i18n';
import useHotels from '@/src/store/hotelStore';
import { CloseIcon, LogoMark, SearchIcon } from '../icons';

const languageNames: Record<string, string> = { en: 'English', es: 'Español' };

/** Brand, search box and language switch. */
const AppHeader: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  const query = useHotels((state) => state.query);
  const setQuery = useHotels((state) => state.setQuery);

  return (
    <header className="relative z-20 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-3 px-4 sm:gap-6 lg:px-6">
        <div className="flex shrink-0 items-center gap-2.5">
          <LogoMark className="size-9 text-brand-700" />
          <div className="leading-tight">
            <h1 className="text-[17px] font-bold tracking-tight text-slate-900">
              {t('hotel-finder')}
            </h1>
            <p className="hidden text-xs text-slate-500 sm:block">
              {t('brand-tagline')}
            </p>
          </div>
        </div>

        <form
          role="search"
          className="relative hidden max-w-md flex-1 md:block lg:ml-8"
          onSubmit={(event) => event.preventDefault()}
        >
          <SearchField query={query} setQuery={setQuery} />
        </form>

        <nav
          aria-label={t('language')}
          className="ml-auto flex shrink-0 rounded-full border border-slate-200 bg-slate-50 p-0.5"
        >
          {locales.map((option) => {
            const active = option === locale;
            return (
              <Link
                key={option}
                href={`/${option}`}
                hrefLang={option}
                lang={option}
                aria-current={active ? 'page' : undefined}
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
                  active
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {option}
                <span className="sr-only"> {languageNames[option]}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <form
        role="search"
        className="relative px-4 pb-3 md:hidden"
        onSubmit={(event) => event.preventDefault()}
      >
        <SearchField query={query} setQuery={setQuery} id="search-mobile" />
      </form>
    </header>
  );
};

interface SearchFieldProps {
  query: string;
  setQuery: (query: string) => void;
  id?: string;
}

function SearchField({ query, setQuery, id = 'search' }: SearchFieldProps) {
  const t = useTranslations();
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {t('search-label')}
      </label>
      <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      <input
        id={id}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t('search-placeholder')}
        autoComplete="off"
        className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-500 transition focus:border-brand-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-600/15 [&::-webkit-search-cancel-button]:hidden"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-brand-600"
        >
          <CloseIcon className="size-4" />
          <span className="sr-only">{t('clear-search')}</span>
        </button>
      )}
    </div>
  );
}

export default AppHeader;
