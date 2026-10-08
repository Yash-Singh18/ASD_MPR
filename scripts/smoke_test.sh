#!/usr/bin/env bash
# End-to-end rental flow: list vehicles -> add to booking -> confirm -> track -> return.
# Usage: scripts/smoke_test.sh [api_base_url]   (default http://localhost:8000)
set -euo pipefail

API="${1:-http://localhost:8000}"
json=(-H 'content-type: application/json')

step() { printf '==> %s\n' "$*"; }
fail() { printf 'FAIL: %s\n' "$*" >&2; exit 1; }

step "health"
[ "$(curl -fsS "$API/health" | jq -r .status)" = ok ] || fail "health check"

step "list vehicles"
count=$(curl -fsS "$API/products" | jq length)
[ "$count" -gt 0 ] || fail "no vehicles found"
vehicle=$(curl -fsS "$API/products" | jq '[.[] | select(.stock > 0)][0]')
vid=$(jq -r .id <<<"$vehicle")
rate=$(jq -r .price <<<"$vehicle")
echo "    $count vehicles, booking #$vid ($(jq -r .name <<<"$vehicle") at \$$rate/day)"

step "search vehicles by type"
types=$(curl -fsS "$API/categories" | jq length)
[ "$types" -gt 0 ] || fail "no vehicle types"

step "add vehicle to booking"
curl -fsS -X POST "$API/cart/items" "${json[@]}" -d "{\"product_id\":$vid,\"quantity\":1}" >/dev/null
total=$(curl -fsS "$API/cart" | jq -r .total)
[ "$total" = "$rate" ] || fail "cart total $total != rate $rate"

step "confirm booking (fake payment)"
order=$(curl -fsS -X POST "$API/orders/checkout" "${json[@]}" \
  -d '{"customer_name":"Smoke Test","address":"Test Pickup Point"}')
oid=$(jq -r .id <<<"$order")
[ "$(jq -r .status <<<"$order")" = placed ] || fail "new booking should be 'placed'"
[ "$(curl -fsS "$API/cart" | jq '.items | length')" = 0 ] || fail "cart not emptied"

step "booking lifecycle: confirmed -> on rent -> returned"
for status in packed out_for_delivery delivered; do
  got=$(curl -fsS -X PUT "$API/orders/$oid/status" "${json[@]}" -d "{\"status\":\"$status\"}" | jq -r .status)
  [ "$got" = "$status" ] || fail "expected $status, got $got"
done

step "metrics endpoint"
curl -fsS "$API/metrics" | grep -q '^http_requests_total' || fail "no Prometheus metrics"

step "cleanup"
curl -fsS -X DELETE "$API/orders/$oid" >/dev/null

echo "All smoke checks passed"
