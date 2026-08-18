import "./global.css";
import "./styles/index.scss";
import Header from "./components/Header";
import Footer from "./components/Footer";
import website from "./config/website";
import { PageContextProvider } from "./context/PageContext";
import { getSettings } from "./sanity-api/sanity-queries";
import { LocaleContextProvider } from "./context/LocaleContext";
import { draftMode } from "next/headers";
import VisualEditing from "./components/ui/VisualEditingLazy";
import localFont from "next/font/local";
import clsx from "clsx";
import { ViewTransitions } from "next-view-transitions";
import Cursor from "./components/ui/Cursor";
import { HeaderContextProvider } from "./context/HeaderContext";
import { CartContextProvider } from "./context/CartContext";
import CartModal from "./components/ui/CartModalLazy";
import Gridder from "./components/ui/Gridder";
import BandeauContextuel from "./components/ui/BandeauContextuel";
import NavigationProgressBar from "./components/ui/NavigationProgressBar";
import CookieWrapper from "./components/ui/CookieWrapper";
// const sourceSans = Source_Sans_3({
//   subsets: ["latin"],
// });
const PPRightGrotesk = localFont({
  src: [
    {
      path: "./styles/fonts/PPRightGrotesk-WideLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "./styles/fonts/PPRightGrotesk-WideLightItalic.woff2",
      weight: "200",
      style: "italic",
    },
    {
      path: "./styles/fonts/PPRightGrotesk-WideRegular.woff2",
      weight: "450",
      style: "normal",
    },
    {
      path: "./styles/fonts/PPRightGrotesk-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./styles/fonts/PPRightGrotesk-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "./styles/fonts/PPRightGrotesk-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./styles/fonts/PPRightGrotesk-RegularItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./styles/fonts/PPRightGrotesk-TightDark.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "./styles/fonts/PPRightGrotesk-TightDarkItalic.woff2",
      weight: "800",
      style: "italic",
    },
  ],
  variable: "--font-primary",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(website.url),
  title: {
    template: `%s — ${website.title}`,
    default: website.title,
  },
  description: website.description,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const bandeauContextuel = settings?.bandeauContextuel;
  const { isEnabled } = await draftMode();
  return (
    <html lang='fr' className={clsx("is-loading", PPRightGrotesk.className)}>
      <body className={clsx("is-loading")} data-theme='theme-fhcb'>
        <NavigationProgressBar />
        <div id='page'>
          <Gridder />
          <LocaleContextProvider>
            <CookieWrapper settings={settings}>
              <PageContextProvider settings={settings}>
                <CartContextProvider>
                  <ViewTransitions>
                    <HeaderContextProvider>
                      <Header settings={settings} />
                    </HeaderContextProvider>
                    {/* {bandeauContextuel && (
                      <BandeauContextuel
                        cta={bandeauContextuel.cta}
                        text={bandeauContextuel.text}
                        dateExpiration={bandeauContextuel.dateExpiration}
                      />
                    )} */}
                    <main>{children}</main>
                    <Footer settings={settings} />
                    <CartModal />
                  </ViewTransitions>
                  {/* <Cursor color='black' size={20} /> */}
                  {isEnabled && <VisualEditing zIndex={1000} />}
                </CartContextProvider>
              </PageContextProvider>
            </CookieWrapper>
          </LocaleContextProvider>
        </div>
      </body>
    </html>
  );
}
