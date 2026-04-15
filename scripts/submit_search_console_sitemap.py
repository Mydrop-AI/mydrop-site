#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build


REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_CLIENT_SECRET_FILE = REPO_ROOT / "google-search-console.json"
DEFAULT_TOKEN_FILE = REPO_ROOT / ".google-search-console-token.json"
DEFAULT_DOMAIN_PROPERTY = "sc-domain:mydropai.com"
DEFAULT_WWW_PROPERTY = "https://www.mydropai.com/"
DEFAULT_ROOT_PROPERTY = "https://mydropai.com/"
DEFAULT_WWW_SITEMAP = "https://www.mydropai.com/sitemap.xml"
DEFAULT_ROOT_SITEMAP = "https://mydropai.com/sitemap.xml"
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


def submission_plan(args: argparse.Namespace) -> list[tuple[str, str]]:
    return [
        (args.domain_property, args.root_sitemap_url),
        (args.domain_property, args.www_sitemap_url),
        (args.root_property, args.root_sitemap_url),
        (args.www_property, args.www_sitemap_url),
    ]


def submit_all(args: argparse.Namespace) -> dict:
    creds = get_credentials(Path(args.client_secret_file), Path(args.token_file))
    service = build("webmasters", "v3", credentials=creds, cache_discovery=False)

    results: list[dict] = []
    ok = True

    for site_url, sitemap_url in submission_plan(args):
        try:
            api_response = service.sitemaps().submit(siteUrl=site_url, feedpath=sitemap_url).execute()
            results.append(
                {
                    "ok": True,
                    "site_url": site_url,
                    "sitemap_url": sitemap_url,
                    "api_response": api_response,
                }
            )
        except Exception as exc:  # pragma: no cover - depends on external API
            ok = False
            results.append(
                {
                    "ok": False,
                    "site_url": site_url,
                    "sitemap_url": sitemap_url,
                    "error": str(exc),
                }
            )

    return {
        "ok": ok,
        "results": results,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Submit all Mydrop sitemap variants to Google Search Console.")
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
    parser.add_argument(
        "--domain-property",
        default=os.environ.get("SEARCH_CONSOLE_DOMAIN_PROPERTY", DEFAULT_DOMAIN_PROPERTY),
        help=f"Domain property identifier. Default: {DEFAULT_DOMAIN_PROPERTY}",
    )
    parser.add_argument(
        "--www-property",
        default=os.environ.get("SEARCH_CONSOLE_WWW_PROPERTY", DEFAULT_WWW_PROPERTY),
        help=f"WWW URL-prefix property. Default: {DEFAULT_WWW_PROPERTY}",
    )
    parser.add_argument(
        "--root-property",
        default=os.environ.get("SEARCH_CONSOLE_ROOT_PROPERTY", DEFAULT_ROOT_PROPERTY),
        help=f"Root URL-prefix property. Default: {DEFAULT_ROOT_PROPERTY}",
    )
    parser.add_argument(
        "--www-sitemap-url",
        default=os.environ.get("SEARCH_CONSOLE_WWW_SITEMAP_URL", DEFAULT_WWW_SITEMAP),
        help=f"WWW sitemap URL. Default: {DEFAULT_WWW_SITEMAP}",
    )
    parser.add_argument(
        "--root-sitemap-url",
        default=os.environ.get("SEARCH_CONSOLE_ROOT_SITEMAP_URL", DEFAULT_ROOT_SITEMAP),
        help=f"Root sitemap URL. Default: {DEFAULT_ROOT_SITEMAP}",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    result = submit_all(args)
    print(json.dumps(result, indent=2))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
