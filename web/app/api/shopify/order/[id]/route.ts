export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const res = await fetch(
    `https://${process.env.SHOPIFY_DOMAIN}/admin/api/2024-01/orders.json?name=${id}&status=any`,
    {
      headers: { "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_TOKEN! },
    },
  );
  const { orders } = await res.json();
  return Response.json(orders?.[0] ?? null);
}
