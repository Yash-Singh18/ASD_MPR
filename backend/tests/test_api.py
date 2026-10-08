def make_product(client, **kw):
    body = {"name": "Milk", "price": 2.5, "stock": 10, **kw}
    r = client.post("/products", json=body)
    assert r.status_code == 201, r.text
    return r.json()


def test_health(client):
    assert client.get("/health").json() == {"status": "ok"}


def test_category_crud(client):
    r = client.post("/categories", json={"name": "Dairy"})
    assert r.status_code == 201
    cid = r.json()["id"]
    assert client.post("/categories", json={"name": "Dairy"}).status_code == 409
    assert client.put(f"/categories/{cid}", json={"name": "Dairy & Eggs"}).json()["name"] == "Dairy & Eggs"
    assert len(client.get("/categories").json()) == 1
    assert client.delete(f"/categories/{cid}").status_code == 204
    assert client.get(f"/categories/{cid}").status_code == 404


def test_product_crud_and_search(client):
    cid = client.post("/categories", json={"name": "Snacks"}).json()["id"]
    p = make_product(client, name="Potato Chips", category_id=cid)
    make_product(client, name="Banana")
    assert p["category"]["name"] == "Snacks"

    assert len(client.get("/products").json()) == 2
    assert [x["name"] for x in client.get("/products", params={"q": "chip"}).json()] == ["Potato Chips"]
    assert len(client.get("/products", params={"category_id": cid}).json()) == 1

    r = client.put(f"/products/{p['id']}", json={"name": "Chips", "price": 3, "stock": 5})
    assert r.json()["name"] == "Chips"
    assert client.delete(f"/products/{p['id']}").status_code == 204
    assert client.get(f"/products/{p['id']}").status_code == 404


def test_product_validation(client):
    assert client.post("/products", json={"name": "x", "price": 0}).status_code == 422
    assert client.post("/products", json={"name": "x", "price": 1, "category_id": 99}).status_code == 422


def test_cart_flow(client):
    p = make_product(client, price=2.0)
    r = client.post("/cart/items", json={"product_id": p["id"], "quantity": 2})
    assert r.status_code == 201
    client.post("/cart/items", json={"product_id": p["id"], "quantity": 1})
    cart = client.get("/cart").json()
    assert cart["items"][0]["quantity"] == 3
    assert cart["total"] == 6.0

    item_id = cart["items"][0]["id"]
    assert client.put(f"/cart/items/{item_id}", json={"quantity": 1}).json()["total"] == 2.0
    assert client.delete(f"/cart/items/{item_id}").json()["items"] == []
    assert client.post("/cart/items", json={"product_id": 999}).status_code == 404


def test_checkout_flow(client):
    p = make_product(client, price=4.0, stock=5)
    client.post("/cart/items", json={"product_id": p["id"], "quantity": 2})
    r = client.post("/orders/checkout", json={"customer_name": "Asha", "address": "12 Fake St"})
    assert r.status_code == 201
    order = r.json()
    assert order["total"] == 8.0 and order["eta_minutes"] == 10 and order["status"] == "placed"
    assert order["items"][0]["quantity"] == 2

    assert client.get("/cart").json()["items"] == []
    assert client.get(f"/products/{p['id']}").json()["stock"] == 3

    r = client.put(f"/orders/{order['id']}/status", json={"status": "delivered"})
    assert r.json()["status"] == "delivered" and r.json()["eta_minutes"] == 0
    assert client.put(f"/orders/{order['id']}/status", json={"status": "bogus"}).status_code == 422
    assert len(client.get("/orders").json()) == 1
    assert client.delete(f"/orders/{order['id']}").status_code == 204


def test_checkout_errors(client):
    body = {"customer_name": "A", "address": "B"}
    assert client.post("/orders/checkout", json=body).status_code == 400
    p = make_product(client, stock=1)
    client.post("/cart/items", json={"product_id": p["id"], "quantity": 5})
    assert client.post("/orders/checkout", json=body).status_code == 409
