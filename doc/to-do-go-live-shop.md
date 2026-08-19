1. Sortir la boutique du mode privé (bloquant)
   Tant que la boutique Shopify est en "Private"/mot de passe, le checkout (/cart/{variant}:{qty} → page Shopify hébergée) tombera sur le mur de mot de passe, donc aucun achat réel n'est possible. Ça nécessite un plan Shopify payant actif si ce n'est pas déjà fait, et un vrai moyen de paiement configuré (Shopify Payments ou autre gateway — probablement en mode test/Bogus Gateway actuellement).

2. Amener le client vers la page de confirmation (bloquant pour la page de confirmation)
   ~~Redirection automatique via "Additional scripts" sur la page de paiement~~ — n'existe plus sur cette boutique (Shopify a retiré ce champ pour les boutiques non-Plus, migration "Checkout Extensibility"). Vérifié le 2026-08-18 : la section "Page d'état de la commande" n'apparaît plus du tout dans Paramètres → Paiement.

   Approche retenue à la place : ajouter un lien dans l'e-mail de confirmation de commande (Notifications → Confirmation de commande → Modifier le code), en Liquid, pointant vers notre page :
   `https://henricartierbresson.org/shopify/confirmation?order_id={{ order.order_number }}` (domaine à confirmer)
   Le client clique depuis l'e-mail au lieu d'être redirigé automatiquement juste après paiement — reste sur le même flux (order_id en query param → /api/shopify/order/[id]).

3. Variables d'environnement manquantes (je viens de vérifier .env.local)
   SHOPIFY_DOMAIN et SHOPIFY_ADMIN_TOKEN — utilisées par /api/shopify/order/[id] pour récupérer la commande — ne sont pas définies, ni en local ni (probablement) en prod. C'est d'ailleurs ce qui causait le 500 que j'ai vu pendant les tests (getaddrinfo ENOTFOUND undefined). Il faut :

Créer une custom app dans l'admin Shopify avec le scope read_orders
Récupérer son Admin API access token
Définir SHOPIFY_DOMAIN + SHOPIFY_ADMIN_TOKEN en local (pour tester) et dans les env vars Vercel de prod 4. Avant la mise en prod du template
Ne pas oublier de réactiver clearCart() dans OrderConfirmation.tsx (actuellement désactivé exprès pour vos tests).

5. Test de bout en bout une fois 1-3 faits
   Ajout panier → checkout Shopify (carte de test) → retour sur /shopify/confirmation → vérifier commande/statut affichés → vérifier que le panier se vide.
