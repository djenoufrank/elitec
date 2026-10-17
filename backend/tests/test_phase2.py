"""Phase 2 backend tests: auth + tickets + KB + blog (CMS) + contact admin guard."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("BACKEND_URL", "http://localhost:8000").rstrip("/")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD")
CUSTOMER_EMAIL = os.environ.get("CUSTOMER_EMAIL")
CUSTOMER_PASSWORD = os.environ.get("CUSTOMER_PASSWORD")


def require_test_credentials(*values):
    if not all(values):
        pytest.skip("Configure ADMIN_EMAIL/PASSWORD and CUSTOMER_EMAIL/PASSWORD to run API tests")


# ---------------- Fixtures ----------------
@pytest.fixture(scope="session")
def admin_token():
    require_test_credentials(ADMIN_EMAIL, ADMIN_PASSWORD)
    r = requests.post(f"{BASE_URL}/api/auth/login",
                      json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=20)
    assert r.status_code == 200, f"admin login failed: {r.status_code} {r.text}"
    return r.json()["token"]


@pytest.fixture(scope="session")
def customer_token():
    require_test_credentials(CUSTOMER_EMAIL, CUSTOMER_PASSWORD)
    r = requests.post(f"{BASE_URL}/api/auth/login",
                      json={"email": CUSTOMER_EMAIL, "password": CUSTOMER_PASSWORD}, timeout=20)
    assert r.status_code == 200, f"customer login failed: {r.status_code} {r.text}"
    return r.json()["token"]


def H(token):
    return {"Authorization": f"Bearer {token}"}


# ---------------- Auth ----------------
class TestAuth:
    def test_login_admin(self):
        r = requests.post(f"{BASE_URL}/api/auth/login",
                          json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=20)
        assert r.status_code == 200
        data = r.json()
        assert "token" in data and isinstance(data["token"], str) and len(data["token"]) > 20
        assert data["user"]["role"] == "admin"
        assert data["user"]["email"] == ADMIN_EMAIL

    def test_login_customer(self):
        r = requests.post(f"{BASE_URL}/api/auth/login",
                          json={"email": CUSTOMER_EMAIL, "password": CUSTOMER_PASSWORD}, timeout=20)
        assert r.status_code == 200
        data = r.json()
        assert data["user"]["role"] == "customer"
        assert data["user"]["email"] == CUSTOMER_EMAIL

    def test_login_wrong_password(self):
        r = requests.post(f"{BASE_URL}/api/auth/login",
                          json={"email": ADMIN_EMAIL, "password": "wrong-pass"}, timeout=20)
        assert r.status_code == 401

    def test_register_new_customer(self):
        email = f"TEST_user_{uuid.uuid4().hex[:8]}@example.com"
        r = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": email, "password": "Passw0rd!", "name": "Test User", "company": "TestCo",
        }, timeout=20)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "token" in data
        assert data["user"]["role"] == "customer"
        assert data["user"]["email"] == email.lower()

        # /me with that token
        me = requests.get(f"{BASE_URL}/api/auth/me", headers=H(data["token"]), timeout=20)
        assert me.status_code == 200
        assert me.json()["email"] == email.lower()

    def test_register_duplicate(self):
        r = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": ADMIN_EMAIL, "password": "whatever", "name": "x",
        }, timeout=20)
        assert r.status_code == 400

    def test_me_requires_token(self):
        r = requests.get(f"{BASE_URL}/api/auth/me", timeout=20)
        assert r.status_code == 401

    def test_me_with_admin_token(self, admin_token):
        r = requests.get(f"{BASE_URL}/api/auth/me", headers=H(admin_token), timeout=20)
        assert r.status_code == 200
        assert r.json()["role"] == "admin"


# ---------------- Tickets ----------------
class TestTickets:
    created_ticket_id = None

    def test_tickets_require_auth(self):
        r = requests.get(f"{BASE_URL}/api/tickets", timeout=20)
        assert r.status_code == 401

    def test_customer_create_ticket(self, customer_token):
        payload = {"subject": "TEST_Email outage", "description": "All inboxes are offline",
                   "priority": "High", "category": "Email"}
        r = requests.post(f"{BASE_URL}/api/tickets", headers=H(customer_token), json=payload, timeout=20)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["subject"] == payload["subject"]
        assert data["priority"] == "High"
        assert data["status"] == "Open"
        assert data["user_email"] == CUSTOMER_EMAIL
        TestTickets.created_ticket_id = data["id"]

    def test_customer_list_only_own(self, customer_token):
        r = requests.get(f"{BASE_URL}/api/tickets", headers=H(customer_token), timeout=20)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        for t in items:
            assert t["user_email"] == CUSTOMER_EMAIL
        # the created one is there
        assert any(t["id"] == TestTickets.created_ticket_id for t in items)

    def test_admin_list_all(self, admin_token, customer_token):
        # ensure there's at least one customer ticket
        assert TestTickets.created_ticket_id is not None
        r = requests.get(f"{BASE_URL}/api/tickets", headers=H(admin_token), timeout=20)
        assert r.status_code == 200
        items = r.json()
        assert any(t["id"] == TestTickets.created_ticket_id for t in items)

    def test_customer_add_comment(self, customer_token):
        tid = TestTickets.created_ticket_id
        r = requests.post(f"{BASE_URL}/api/tickets/{tid}/comments", headers=H(customer_token),
                          json={"body": "TEST_cust_comment"}, timeout=20)
        assert r.status_code == 200
        assert any(c["body"] == "TEST_cust_comment" for c in r.json()["comments"])

    def test_admin_add_comment(self, admin_token):
        tid = TestTickets.created_ticket_id
        r = requests.post(f"{BASE_URL}/api/tickets/{tid}/comments", headers=H(admin_token),
                          json={"body": "TEST_admin_comment"}, timeout=20)
        assert r.status_code == 200
        bodies = [c["body"] for c in r.json()["comments"]]
        assert "TEST_admin_comment" in bodies

    def test_customer_cannot_update_status(self, customer_token):
        tid = TestTickets.created_ticket_id
        r = requests.patch(f"{BASE_URL}/api/tickets/{tid}/status",
                           headers=H(customer_token), json={"status": "Resolved"}, timeout=20)
        assert r.status_code == 403

    def test_admin_update_status(self, admin_token):
        tid = TestTickets.created_ticket_id
        r = requests.patch(f"{BASE_URL}/api/tickets/{tid}/status",
                           headers=H(admin_token), json={"status": "In Progress"}, timeout=20)
        assert r.status_code == 200
        assert r.json()["status"] == "In Progress"

        # Verify via GET
        g = requests.get(f"{BASE_URL}/api/tickets/{tid}", headers=H(admin_token), timeout=20)
        assert g.status_code == 200
        assert g.json()["status"] == "In Progress"


# ---------------- Blog ----------------
class TestBlog:
    created_post_id = None

    def test_public_list(self):
        r = requests.get(f"{BASE_URL}/api/blog", timeout=20)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= 1
        # seeded titles
        titles = [p["title"] for p in items]
        assert any("Azure migration" in t for t in titles)

    def test_customer_cannot_create(self, customer_token):
        r = requests.post(f"{BASE_URL}/api/blog", headers=H(customer_token), json={
            "title": "TEST_should_fail", "category": "x", "excerpt": "x", "body": "x",
        }, timeout=20)
        assert r.status_code == 403

    def test_admin_create_update_delete(self, admin_token):
        # Create
        payload = {"title": "TEST_post", "category": "Testing", "excerpt": "x", "body": "body", "published": True}
        r = requests.post(f"{BASE_URL}/api/blog", headers=H(admin_token), json=payload, timeout=20)
        assert r.status_code == 200, r.text
        pid = r.json()["id"]
        TestBlog.created_post_id = pid

        # GET single
        g = requests.get(f"{BASE_URL}/api/blog/{pid}", timeout=20)
        assert g.status_code == 200
        assert g.json()["title"] == "TEST_post"

        # PUT
        up = requests.put(f"{BASE_URL}/api/blog/{pid}", headers=H(admin_token), json={
            **payload, "title": "TEST_post_updated",
        }, timeout=20)
        assert up.status_code == 200
        assert up.json()["title"] == "TEST_post_updated"

        # GET /all (admin)
        all_r = requests.get(f"{BASE_URL}/api/blog/all", headers=H(admin_token), timeout=20)
        assert all_r.status_code == 200

        # Customer can't /all
        # (token not needed here — use customer fixture handled at end)

        # DELETE
        d = requests.delete(f"{BASE_URL}/api/blog/{pid}", headers=H(admin_token), timeout=20)
        assert d.status_code == 200
        # Verify gone
        g2 = requests.get(f"{BASE_URL}/api/blog/{pid}", timeout=20)
        assert g2.status_code == 404

    def test_blog_all_admin_only(self, customer_token):
        r = requests.get(f"{BASE_URL}/api/blog/all", headers=H(customer_token), timeout=20)
        assert r.status_code == 403


# ---------------- KB ----------------
class TestKB:
    def test_public_list(self):
        r = requests.get(f"{BASE_URL}/api/kb", timeout=20)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= 1

    def test_customer_cannot_create(self, customer_token):
        r = requests.post(f"{BASE_URL}/api/kb", headers=H(customer_token), json={
            "title": "TEST_kb", "category": "x", "summary": "x", "body": "x",
        }, timeout=20)
        assert r.status_code == 403

    def test_admin_crud(self, admin_token):
        payload = {"title": "TEST_kb_article", "category": "Testing",
                   "summary": "s", "body": "b", "published": True}
        c = requests.post(f"{BASE_URL}/api/kb", headers=H(admin_token), json=payload, timeout=20)
        assert c.status_code == 200, c.text
        aid = c.json()["id"]

        u = requests.put(f"{BASE_URL}/api/kb/{aid}", headers=H(admin_token),
                         json={**payload, "title": "TEST_kb_updated"}, timeout=20)
        assert u.status_code == 200
        assert u.json()["title"] == "TEST_kb_updated"

        d = requests.delete(f"{BASE_URL}/api/kb/{aid}", headers=H(admin_token), timeout=20)
        assert d.status_code == 200
        g = requests.get(f"{BASE_URL}/api/kb/{aid}", timeout=20)
        assert g.status_code == 404


# ---------------- Contact admin guard ----------------
class TestContactGuard:
    def test_get_contact_no_auth(self):
        r = requests.get(f"{BASE_URL}/api/contact", timeout=20)
        assert r.status_code == 401

    def test_get_contact_customer_forbidden(self, customer_token):
        r = requests.get(f"{BASE_URL}/api/contact", headers=H(customer_token), timeout=20)
        assert r.status_code == 403

    def test_get_contact_admin_ok(self, admin_token):
        r = requests.get(f"{BASE_URL}/api/contact", headers=H(admin_token), timeout=20)
        assert r.status_code == 200
        assert isinstance(r.json(), list)
