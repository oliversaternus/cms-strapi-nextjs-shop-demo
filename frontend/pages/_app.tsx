import React, { useState, useCallback, useMemo } from 'react';
import Head from 'next/head';
import App, { AppContext, AppProps } from 'next/app';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { themeDefault as theme } from '../src/theme';
import Router from 'next/router';
import { NotificationContextProvider } from '../src/contexts/NotificationContext';
import { CircularProgress } from '@material-ui/core';
import cookies from 'next-cookies';
import CookieMessage from '../src/components/CookieMessage';
import { CookieContextProvider, AcceptCookieType } from '../src/contexts/CookieContext';
import { IntegrationsContextProvider } from '../src/contexts/IntegrationsContext';
import { ShopContextProvider } from '../src/contexts/ShopContext';
import Analytics, { ReactGA } from '../src/tools/Analytics';
import Chat from '../src/tools/Chat';
import '../styles.css';
import { getCookieConfig, getGlobalData, getIntegrations, getProducts, getShopConfig } from '../src/tools/Service';
import { CookieConfig, GlobalData, Integrations, Product, ShopConfig } from '../src/tools/Models';
import Navigation from '../src/components/Navigation';
import Footer from '../src/components/Footer';

let loadingDebounce: NodeJS.Timeout | undefined = undefined;

const defaultMeta = {
  title: '',
  description: '',
  keywords: '',
  author: ''
}

interface ExtendedAppProps extends AppProps {
  documentCookies: Record<string, string | undefined>;
  globalData: GlobalData;
  integrations: Integrations;
  cookieConfig: CookieConfig;
  shopConfig: ShopConfig;
}

function CustomApp(props: ExtendedAppProps) {
  const { Component, pageProps, documentCookies, globalData, integrations, cookieConfig, shopConfig } = props;
  const { navigation, footer, logo, favicon, copyright, previewImage } = globalData;
  const [isLoading, setIsLoading] = useState(false);

  const initialCookies = useMemo(() => {
    try {
      // documentCookies should be already parsed
      if (typeof (documentCookies?.acceptedCookies as unknown) === 'object' && documentCookies?.acceptedCookies !== null) {
        return documentCookies?.acceptedCookies as unknown as AcceptCookieType;
      } else {
        // could happen only if nextJS changes it's cookie parsing behaviour
        return JSON.parse(documentCookies?.acceptedCookies + '') as AcceptCookieType;
      }
    } catch (e) {
    }
  }, [documentCookies]);

  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    jssStyles?.parentElement?.removeChild(jssStyles);

    const onRouteChangeStart = () => {
      if (loadingDebounce) {
        clearTimeout(loadingDebounce);
      }
      loadingDebounce = setTimeout(() => {
        setIsLoading(true);
      }, 250);
    };

    const onRouteChangeComplete = () => {
      if (loadingDebounce) {
        clearTimeout(loadingDebounce);
      }
      if (!window.location.host.startsWith('localhost')) {
        ReactGA.pageview(window.location.pathname);
      }
      window.scrollTo(0, 0);
      setIsLoading(false);
    };

    Router.events.on('routeChangeStart', onRouteChangeStart);
    Router.events.on('routeChangeComplete', onRouteChangeComplete);
    return () => {
      Router.events.off('routeChangeStart', onRouteChangeStart);
      Router.events.off('routeChangeComplete', onRouteChangeComplete);
    }
  }, [setIsLoading]);

  const getPageTitle = useCallback(() => {
    if (pageProps?.page && pageProps.page.title && pageProps.page.subtitle) {
      return `${pageProps.page.title} | ${pageProps.page.subtitle}`;
    }
    if (pageProps?.page?.title) {
      return pageProps.page.title;
    }
    return defaultMeta.title
  }, [pageProps]);

  return (
    <React.Fragment>
      <Head>
        <title>{getPageTitle()}</title>
        <meta charSet="UTF-8" />
        {favicon && <link rel="icon" href={favicon?.url} />}
        <meta name="description" content={pageProps?.description || defaultMeta.description} />
        <meta name="keywords" content={pageProps?.keywords || defaultMeta.keywords} />
        <meta name="author" content={pageProps?.author || defaultMeta.author} />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <meta name="theme-color" content="#405166" />
        <meta property="og:title" content={getPageTitle()} />
        <meta property="og:description" content={pageProps?.description || defaultMeta.description} />
        {previewImage && <meta property="og:image" content={previewImage?.url} />}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CookieContextProvider initialValue={initialCookies} session={documentCookies.sessionId}>
          <IntegrationsContextProvider integrations={integrations}>
            <NotificationContextProvider>
              <ShopContextProvider config={shopConfig}>
                {integrations.Analytics?.enabled &&
                  <Analytics
                    trackingID={integrations.Analytics.GATrackingID}
                    cookieValue={integrations.Analytics.cookieValue}
                  />
                }
                {integrations.Chat?.enabled &&
                  <Chat
                    tawkToID={integrations.Chat.TawkToID}
                    cookieValue={integrations.Chat.cookieValue}
                  />
                }
                {isLoading &&
                  <div
                    className="loading-overlay"
                    style={{ background: theme.palette.backgrounds.main }}
                  >
                    <CircularProgress color='secondary' />
                  </div>
                }
                {(!initialCookies || initialCookies?.none === true) &&
                  cookieConfig.enabled &&
                  <CookieMessage {...cookieConfig} />
                }
                <Navigation
                  logoSrc={logo?.url}
                  links={navigation}
                />
                <Component {...pageProps} />
                <Footer
                  logoSrc={logo?.url}
                  columns={footer}
                  copyright={copyright}
                />
                <base target='_blank'></base>
              </ShopContextProvider>
            </NotificationContextProvider>
          </IntegrationsContextProvider>
        </CookieContextProvider>
      </ThemeProvider>
    </React.Fragment>
  );
}

CustomApp.getInitialProps = async (appContext: AppContext): Promise<{ documentCookies: Record<string, string | undefined>, pageProps: any, globalData: GlobalData, integrations: Integrations, cookieConfig: CookieConfig, shopConfig: ShopConfig }> => {
  const documentCookies = cookies(appContext.ctx) || {};
  const appProps = await App.getInitialProps(appContext);
  const responses = await Promise.all([getGlobalData(), getIntegrations(), getCookieConfig(), getProducts({ _sort: 'name:DESC' }), getShopConfig()]);
  const globalResponse = responses[0];
  const integrationsResponse = responses[1];
  const cookieConfigResponse = responses[2];
  const productsResponse = responses[3];
  const shopConfigResponse = responses[4];
  const globalData: GlobalData = (!globalResponse.isError && globalResponse.data) || {};
  const integrations: Integrations = (!integrationsResponse.isError && integrationsResponse.data) || {};
  const cookieConfig: CookieConfig = (!cookieConfigResponse.isError && cookieConfigResponse.data) || {};
  const products: Product[] = (!productsResponse.isError && productsResponse.data) || [];
  const shopConfig: ShopConfig = (!shopConfigResponse.isError && shopConfigResponse.data) || {};
  if (globalData && products.length) {
    const maxId = globalData.navigation?.map(item => item.id).sort((a, b) => b - a)?.[0];
    globalData.navigation = [
      {
        id: (maxId || 9999) + 1,
        title: 'Products',
        links: products.map(product => ({
          id: product.id,
          link: product.name || '',
          path: '/product/' + product.identifier,
          imageUrl: product.image?.formats.thumbnail.url
        })).filter(link => link.id && link.link && link.path)
      },
      ...(globalData.navigation || [])
    ]
  }
  return { documentCookies, globalData, integrations, cookieConfig, shopConfig, ...appProps };
}

export default CustomApp;
