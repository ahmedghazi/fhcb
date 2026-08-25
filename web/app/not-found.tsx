import Link from "next/link";
import { getSettings } from "./sanity-api/sanity-queries";
import { LocaleBlockContent } from "./sanity-api/types/sanity.types";
import Text from "./components/ui/Text";

async function NotFoundPage() {
  const settings = await getSettings();
  return (
    <div className='template template--page-404' data-template='404'>
      <div className='container-fluid'>
        {settings && settings.message404 && (
          <Text input={settings.message404 as LocaleBlockContent} />
        )}
        {!settings && (
          <>
            <h1 style={{ marginBottom: "1.5rem" }}>Page introuvable</h1>
            <div style={{ marginBottom: "2rem" }}>
              <p>Cette page n&apos;existe pas ou a été déplacée.</p>
              <Link href='/'>Retour à l&apos;accueil</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default NotFoundPage;
