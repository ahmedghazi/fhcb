import Link from "next/link";

function NotFoundPage() {
  return (
    <div className="page-404" style={{ padding: "4rem", textAlign: "center" }}>
      <div className="inner">
        <h1 style={{ marginBottom: "1.5rem" }}>Page introuvable</h1>
        <div style={{ marginBottom: "2rem" }}>
          <p>
            Cette page n&apos;existe pas ou a été déplacée.
          </p>
        </div>
        <Link href="/">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
