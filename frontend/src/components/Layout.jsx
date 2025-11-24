import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/useTheme';

function Layout() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <div className="wrap">
      {/* Fixed navbar with consistent height */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 sm:h-20 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="w-full max-w-[980px] mx-auto px-3 sm:px-4 md:px-6 h-full flex justify-between items-center gap-2 sm:gap-4">
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2.5 text-inherit no-underline transition-transform duration-250 hover:translate-x-0.5 flex-shrink-0">
            <img
              src="/nyyts.png"
              alt="Mazaalai logo"
              className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"
            />
            <div className="min-w-0">
              <div className="text-[9px] sm:text-[10px] md:text-[11px] tracking-wider uppercase text-amber-500 dark:text-amber-400 whitespace-nowrap">Nyyts Rangers</div>
              <div className="text-sm sm:text-base md:text-lg font-bold tracking-wide text-slate-900 dark:text-slate-100 leading-tight truncate sm:whitespace-normal">GOBI BEAR FOUNDATION</div>
            </div>
          </Link>
          <div className="flex flex-col items-end gap-0.5 sm:gap-1 flex-shrink-0">
          
            <div className="flex items-center gap-1 sm:gap-2">
              <nav className="flex gap-1 sm:gap-2 items-center" role="navigation">
                <Link 
                  to="/" 
                  className={`no-underline px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border transition-all duration-250 text-[8px] sm:text-[9px] whitespace-nowrap ${
                    location.pathname === '/'
                      ? 'text-amber-500 dark:text-amber-400 border-amber-500/20 dark:border-amber-400/20 bg-white dark:bg-slate-800'
                      : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-amber-500 dark:hover:text-amber-400 hover:border-amber-500/20 dark:hover:border-amber-400/20 hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  Leaderboard
                </Link>
                <Link 
                  to="/about" 
                  className={`no-underline px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border transition-all duration-250 text-[8px] sm:text-[9px] whitespace-nowrap ${
                    location.pathname === '/about'
                      ? 'text-amber-500 dark:text-amber-400 border-amber-500/20 dark:border-amber-400/20 bg-white dark:bg-slate-800'
                      : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-amber-500 dark:hover:text-amber-400 hover:border-amber-500/20 dark:hover:border-amber-400/20 hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  About
                </Link>
              </nav>
              <button 
                className="bg-transparent border border-slate-300 dark:border-slate-700 rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center cursor-pointer text-slate-600 dark:text-slate-400 transition-all duration-250 ml-1 sm:ml-2 hover:text-amber-500 dark:hover:text-amber-400 hover:border-amber-500/20 dark:hover:border-amber-400/20 hover:bg-white dark:hover:bg-slate-800 flex-shrink-0" 
                onClick={toggleTheme} 
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
                    <circle cx="12" cy="12" r="5"/>
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content with top padding to account for fixed navbar */}
      <div className="pt-16 sm:pt-20">
        <Outlet />
      </div>

      <footer className="mt-2.5 pt-2.5 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-2.5 justify-between items-start text-[9px] text-slate-600 dark:text-slate-400">
        <div className="flex flex-col gap-0.5">
          <div>© {new Date().getFullYear()} Mazaalai Guardians</div>
          <div>Энд бүртгэлтэй хүмүүс бол Говийн эзэн Мазаалай болон Монголын байгалийг хамгаалах бодит баатрууд.</div>
        </div>
        <div className="flex flex-col gap-0.5 text-right">
          <div>
            <svg className="w-3.5 h-3.5 inline-block align-[-2px] mr-1 fill-amber-500 dark:fill-amber-400" viewBox="0 0 24 24">
              <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2C5.57 4 4 5.57 4 7.5v9C4 18.99 5.01 20 6.5 20h11a2.5 2.5 0 0 0 2.5-2.5v-9C20 5.57 18.43 4 16.5 4h-9zM17 7.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 .001 6.001A3 3 0 0 0 12 9z"/>
            </svg>
            Instagram:
            <a href="https://www.instagram.com/nyytsxaalga/" target="_blank" rel="noopener" className="text-amber-500 dark:text-amber-400 no-underline hover:underline">
              @nyytsxaalga
            </a>
          </div>
          <div>
          <a href ="https://maps.app.goo.gl/11tzLazttDeyid6a9"target="_blank" rel="noopener" className="text-amber-500 dark:text-amber-400 no-underline hover:underline">
            <svg className="w-3.5 h-3.5 inline-block align-[-2px] mr-1 fill-amber-500 dark:fill-amber-400" viewBox="0 0 24 24">
               <path d="M12 2a7 7 0 0 1 7 7c0 4.05-3.64 8.38-6.02 10.64a1.3 1.3 0 0 1-1.96 0C8.64 17.38 5 13.05 5 9a7 7 0 0 1 7-7zm0 2a5 5 0 0 0-5 5c0 2.91 2.37 6.29 5 8.97 2.63-2.68 5-6.06 5-8.97a5 5 0 0 0-5-5zm0 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
            </svg>
            "Mazaalai Hub" — хамгаалалтын бүсийн хамтын шүтээн
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
