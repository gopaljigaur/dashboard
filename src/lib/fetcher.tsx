import { useCallback, useEffect, useState } from "react";

import { ISearchProviderProps } from "../components/searchBar";
import { IBookmarkGroupProps } from "../components/bookmarkGroup";
import { IAppCategoryProps } from "../components/appCategory";
import { IAppProps } from "../components/app";
import { IThemeProps } from "./theme";
import { IImprintProps } from "../components/imprint";

const errorMessage = "Failed to load data.";
const inProduction = process.env.NODE_ENV === "production";

/**
 * Handles the response from the fetch requests
 * @param {Response} response - The response given by the fetch request
 * @returns - The response in JSON
 * @throws - Error with given error message if request failed
 */
const handleResponse = (response: Response) => {
  if (response.ok) return response.json();
  throw new Error(errorMessage);
};

export interface ISearchProviderDataProps {
  providers: Array<ISearchProviderProps>;
  error: string | boolean;
}

export interface IBookmarkDataProps {
  groups: Array<IBookmarkGroupProps>;
  error: string | boolean;
}

export interface IAppDataProps {
  categories: Array<IAppCategoryProps>;
  apps: Array<IAppProps>;
  error: string | boolean;
}

export interface IThemeDataProps {
  themes: Array<IThemeProps>;
  error: string | boolean;
}

export interface IImprintDataProps {
  imprint: IImprintProps;
  error: string | boolean;
}

/**
 * Default values for the respective state variables
 */
const defaults = {
  app: {
    categories: [],
    apps: [],
    error: false,
  },
  bookmark: {
    groups: [],
    error: false,
  },
  search: {
    providers: [],
    error: false,
  },
  theme: {
    themes: [],
    error: false,
  },
  imprint: {
    imprint: {
      name: { text: "", link: "" },
      address: { text: "", link: "" },
      phone: { text: "", link: "" },
      email: { text: "", link: "" },
      url: { text: "", link: "" },
      text: "",
    },
    error: false,
  },
};

/**
 * Handles fetch errors by returning the error message.
 * @param {string} type - The type of fetch request that threw an error
 * @param {Error} error - The error itself
 */
const handleError = (status: string, error: Error) => {
  switch (status) {
    case "apps":
      return { ...defaults.app, error: error.message }
    case "bookmark":
      return { ...defaults.bookmark, error: error.message }
    case "searchProvider":
      return { ...defaults.search, error: error.message }
    case "theme":
      return { ...defaults.theme, error: error.message }
    case "imprint":
      return { ...defaults.imprint, error: error.message }
    default:
      break;
  }
}

/**
 * Fetches all of the data by doing fetch requests (only available in production)
 */
const fetchProduction = Promise.all([
  fetch("/data/apps.json").then(handleResponse).catch((error: Error) => handleError("apps", error)),
  fetch("/data/bookmarks.json").then(handleResponse).catch((error: Error) => handleError("bookmark", error)),
  fetch("/data/search.json").then(handleResponse).catch((error: Error) => handleError("searchProvider", error)),
  fetch("/data/themes.json").then(handleResponse).catch((error: Error) => handleError("theme", error)),
  fetch("/data/imprint.json").then(handleResponse).catch((error: Error) => handleError("imprint", error)),
]);

/**
 * Fetches all of the data by importing it (only available in development)
 */
const fetchDevelopment = Promise.all([
  import("../data/apps.json"),
  import("../data/bookmarks.json"),
  import("../data/search.json"),
  import("../data/themes.json"),
  import("../data/imprint.json"),
]);

/**
 * Fetches app, bookmark, search, theme and imprint data and returns it.
 */
export const useFetcher = () => {
  const [appData, setAppData] = useState<IAppDataProps>(defaults.app);

  const [bookmarkData, setBookmarkData] = useState<IBookmarkDataProps>(
    defaults.bookmark
  );

  const [
    searchProviderData,
    setSearchProviderData,
  ] = useState<ISearchProviderDataProps>(defaults.search);

  const [themeData, setThemeData] = useState<IThemeDataProps>(defaults.theme);

  const [imprintData, setImprintData] = useState<IImprintDataProps>(
    defaults.imprint
  );

  const callback = useCallback(() => {
    (inProduction ? fetchProduction : fetchDevelopment).then(
      ([appData, bookmarkData, searchData, themeData, imprintData]: any) => {
        (appData.error) ? setAppData(appData) : setAppData({ ...appData, error: false });
        (bookmarkData.error) ? setBookmarkData(bookmarkData) : setBookmarkData({ ...bookmarkData, error: false });
        (searchData.error) ? setSearchProviderData(searchData) : setSearchProviderData({ ...searchData, error: false });
        (themeData.error) ? setThemeData(themeData) : setThemeData({ ...themeData, error: false });
        (imprintData.error) ? setImprintData(imprintData) : setImprintData({ ...imprintData, error: false });
      }
    );
  }, []);

  useEffect(() => callback(), [callback]);

  return {
    appData,
    bookmarkData,
    searchProviderData,
    themeData,
    imprintData,
    callback
  };
};

export default useFetcher;
