import { createContext, useContext, useMemo } from 'react';
import useApi from '../hooks/useApi';
import { getSite } from '../services/site';

// GET /api/site once at start-up: settings, page content and the service slides, shared by every page.
const SiteContext = createContext(null);

const EMPTY = {};

export function SiteProvider({ children }) {
  // useApi expects an Axios-style response ({ data }), so wrap the unwrapped payload once
  const { data, loading, error, reload } = useApi(() => getSite().then((site) => ({ data: site })));
  const value = useMemo(
    () => ({
      site: data,
      settings: data?.settings || EMPTY,
      content: data?.content || EMPTY,
      services: data?.services || [],
      loading,
      error,
      reload,
    }),
    [data, loading, error, reload]
  );
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);

// One section's copy: useContent('home.hero') -> { hi, title, … } (empty object while loading)
export const useContent = (key) => useSite().content[key] || EMPTY;
