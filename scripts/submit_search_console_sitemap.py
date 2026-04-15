#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
import google.auth
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build


REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_CLIENT_SECRET_FILE = REPO_ROOT / "google-search-console.json"
DEFAULT_TOKEN_FILE = REPO_ROOT / ".google-search-console-token.json"
DEFAULT_SITE_URL = "https://www.mydropai.com/"
DEFAULT_SITEMAP_URL = "https://www.mydropai.com/sitemap.xml"
SCOPES = ["https://www.googleapis.com/auth/webmasters"]



def get_credentials(client_secret_file: Path, token_file: Path):
    creds = None
    if token_file.exists():
        creds = Credentials.from_authorized_user_file(str(token_file), SCOPES)

    if creds and creds.valid:
        return creds

    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
        token_file.write_text(creds.to_json(), encoding="utf-8")
        return creds

    if not client_secret_file.exists():
        raise FileNotFoundError(
            f"OAuth client file not found: {client_secret_file}\n"
            "Expected a Desktop OAuth client JSON from Google Cloud."
        )

    flow = InstalledAppFlow.from_client_secrets_file(str(client_secret_file), SCOPES)
    creds = flow.run_local_server(port=0)
    token_file.write_text(creds.to_json(), encoding="utf-8")
    return creds


def submit_sitemap(site_url: str, sitemap_url: str, client_secret_file: Path, token_file: Path) -> dict:
    creds = get_credentials(client_secret_file, token_file)
    service = build("webmasters", "v3", credentials=creds, cache_discovery=False)
    response = service.sitemaps().submit(siteUrl=site_url, feedpath=sitemap_url).execute()
    return {
        "ok": True,
        "site_url": site_url,
        "sitemap_url": sitemap_url,
        "api_response": response,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Submit sitemap.xml to Google Search Console.")
    parser.add_argument(
        "--site-url",
        default=os.environ.get("SEARCH_CONSOLE_SITE_URL", DEFAULT_SITE_URL),
        help=f"Search Console property URL. Default: {DEFAULT_SITE_URL}",
    )
    parser.add_argument(
        "--sitemap-url",
        default=os.environ.get("SEARCH_CONSOLE_SITEMAP_URL", DEFAULT_SITEMAP_URL),
        help=f"Sitemap URL to submit. Default: {DEFAULT_SITEMAP_URL}",
    )
    parser.add_argument(
        "--client-secret-file",
        default=os.environ.get("SEARCH_CONSOLE_CLIENT_SECRET_FILE", str(DEFAULT_CLIENT_SECRET_FILE)),
        help=f"Path to OAuth client JSON. Default: {DEFAULT_CLIENT_SECRET_FILE}",
    )
    parser.add_argument(
        "--token-file",
        default=os.environ.get("SEARCH_CONSOLE_TOKEN_FILE", str(DEFAULT_TOKEN_FILE)),
        help=f"Path to cached OAuth token JSON. Default: {DEFAULT_TOKEN_FILE}",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    try:
        result = submit_sitemap(
            site_url=args.site_url,
            sitemap_url=args.sitemap_url,
            client_secret_file=Path(args.client_secret_file),
            token_file=Path(args.token_file),
        )
    except Exception as exc:
        print(
            json.dumps(
                {
                    "ok": False,
                    "error": str(exc),
                    "site_url": args.site_url,
                    "sitemap_url": args.sitemap_url,
                },
                indent=2,
            ),
            file=sys.stderr,
        )
        return 1

    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
