-- ============================================================================
-- The Aura Crystals — Analytics & behaviour-based customer segments (read-only)
-- Read server-side with the service_role key (admin analytics).
-- ============================================================================

create or replace view public.customer_metrics as
with paid as (
  select o.customer_id,
         count(*)                    as order_count,
         coalesce(sum(o.total_amount),0) as total_spend,
         min(o.created_at)           as first_purchase,
         max(o.created_at)           as last_purchase
  from public.orders o
  where o.payment_status = 'paid'
  group by o.customer_id
)
select
  c.id as customer_id, c.name, c.email, c.created_at,
  coalesce(p.order_count,0) as order_count,
  coalesce(p.total_spend,0) as total_spend,
  p.first_purchase, p.last_purchase,
  case
    when coalesce(p.order_count,0) = 0 then 'new'
    when p.order_count = 1 and p.first_purchase > now() - interval '30 days' then 'first_time_buyer'
    when p.total_spend >= 15000 then 'high_value'
    when p.order_count >= 4 then 'frequent_buyer'
    when p.last_purchase > now() - interval '90 days' then 'active'
    when p.last_purchase <= now() - interval '90 days' then 'inactive'
    else 'returning'
  end as segment
from public.customers c
left join paid p on p.customer_id = c.id;

create or replace view public.product_performance as
select
  pr.id as product_id, pr.name, pr.slug, pr.category_id,
  coalesce(sum(oi.quantity),0)    as units_sold,
  coalesce(sum(oi.total_price),0) as revenue
from public.products pr
left join public.order_items oi on oi.product_id = pr.id
left join public.orders o       on o.id = oi.order_id and o.payment_status = 'paid'
group by pr.id, pr.name, pr.slug, pr.category_id;

create or replace view public.sales_daily as
select date_trunc('day', o.created_at)::date as day,
       count(*) as orders,
       coalesce(sum(o.total_amount),0) as revenue
from public.orders o
where o.payment_status = 'paid'
group by 1 order by 1;

grant select on public.customer_metrics, public.product_performance, public.sales_daily
  to service_role;
