import "./global.css";
import "./styles/index.scss";
import Header from "./components/Header";
import Footer from "./components/Footer";
import website from "./config/website";
import { PageContextProvider } from "./context/PageContext";
import { getSettings } from "./sanity-api/sanity-queries";
import { LocaleContextProvider } from "./context/LocaleContext";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import localFont from "next/font/local";
import clsx from "clsx";
import LenisScrollProvider from "./components/ui/LenisScrollProvider";
import { ViewTransitions } from "next-view-transitions";
import Cursor from "./components/ui/Cursor";
import { HeaderContextProvider } from "./context/HeaderContext";
import { CartContextProvider } from "./context/CartContext";
import CartModal from "./components/CartModal";
import Gridder from "./components/ui/Gridder";
import BandeauContextuel from "./components/ui/BandeauContextuel";

// const sourceSans = Source_Sans_3({
//   subsets: ["latin"],
// });
const PPRightGrotesk = localFont({
  src: [
    {
      path: "./styles/fonts/PPRightGrotesk-WideLight.woff",
      weight: "200",
      style: "normal",
    },
    {
      path: "./styles/fonts/PPRightGrotesk-WideLightItalic.woff",
      weight: "200",
      style: "italic",
    },
    {
      path: "./styles/fonts/PPRightGrotesk-WideRegular.woff",
      weight: "450",
      style: "normal",
    },
    {
      path: "./styles/fonts/PPRightGrotesk-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "./styles/fonts/PPRightGrotesk-LightItalic.woff",
      weight: "300",
      style: "italic",
    },
    {
      path: "./styles/fonts/PPRightGrotesk-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./styles/fonts/PPRightGrotesk-RegularItalic.woff",
      weight: "400",
      style: "italic",
    },
    {
      path: "./styles/fonts/PPRightGrotesk-TightDark.woff",
      weight: "800",
      style: "normal",
    },
    {
      path: "./styles/fonts/PPRightGrotesk-TightDarkItalic.woff",
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
    <ViewTransitions>
      <html lang='fr' className={clsx("is-loading", PPRightGrotesk.className)}>
        <body className={clsx("is-loading")} data-theme='theme-fhcb'>
          {/* <LenisScrollProvider> */}
          <div id='page'>
            <Gridder />
            <LocaleContextProvider>
              <PageContextProvider settings={settings}>
                <CartContextProvider>
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
                  {/* <Cursor color='black' size={20} /> */}
                  {isEnabled && <VisualEditing zIndex={1000} />}
                </CartContextProvider>
              </PageContextProvider>
            </LocaleContextProvider>
          </div>
          {/* </LenisScrollProvider> */}
        </body>
      </html>
    </ViewTransitions>
  );
}
