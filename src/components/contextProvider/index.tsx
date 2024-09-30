import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { fetchEngineDataConfig } from '../../utils';

interface AppContext {
  lang: 'cn' | 'en';
  version: string;
  versions: { version: string; packages: string }[];
  theme: string;
  setLang: Function;
  setVersion: Function;
  setTheme: Function;
}

const defaultValue: AppContext = {
  lang: 'cn',
  version: '',
  versions: [],
  theme: "light",
  setLang: () => { },
  setVersion: () => { },
  setTheme: () => { }
};

export const AppContext = createContext<AppContext>(defaultValue);
AppContext.displayName = 'AppContext';

const AppContextProvider = (props: PropsWithChildren) => {
  const localStorageLang = localStorage.getItem('lang') === 'en' ? 'en' : 'cn';

  // Compatible with legacy code
  const oldTheme = localStorage.getItem('theme');
  if (oldTheme === 'light-theme') {
    localStorage.setItem('theme', 'light');
  }
  else if (oldTheme === 'dark-theme') {
    localStorage.setItem('theme', 'dark');
  }

  const localStorageTheme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
  const localStorageVersion = localStorage.getItem('version') || '';

  const [lang, setLang] = useState<'cn' | 'en'>(
    localStorageLang || (navigator.language.includes('en') ? 'en' : 'cn')
  );
  const [version, setVersion] = useState(localStorageVersion);
  const [theme, setTheme] = useState(localStorageTheme);

  const [versions, setVersions] = useState<{ version: string; packages: string }[]>([]);

  useEffect(() => {
    (async function () {
      const configRes = await fetchEngineDataConfig();

      if (configRes) {
        setVersions(configRes);
        if (!localStorageVersion) {
          const { version } = configRes[configRes.length - 1];
          localStorage.setItem('version', version);
          setVersion(version);
        }
      }
    })()
  }, []);

  return versions.length > 0 ? <AppContext.Provider value={{ lang, setLang, version, setVersion, theme, setTheme, versions }}>{props.children}</AppContext.Provider> : null;
};
export default AppContextProvider;
