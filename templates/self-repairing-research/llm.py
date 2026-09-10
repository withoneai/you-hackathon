"""One function, `complete`, over the model named by MODEL.

MODEL is `<provider>/<model>`: `openai/gpt-4o` (the default, the one these
templates were verified with) or `anthropic/claude-sonnet-5`. Only the SDK for
the provider you use has to be installed.
"""
from __future__ import annotations

import json
import os
import re

DEFAULT_MODEL = "openai/gpt-4o"


def model_name() -> str:
    return os.environ.get("MODEL", DEFAULT_MODEL)


def complete(system: str, user: str, json_mode: bool = False, max_tokens: int = 4000, temperature: float = 0.2):
    """Return the model's text, or the parsed object when json_mode is set."""
    provider, _, name = model_name().partition("/")
    if provider == "openai":
        from openai import OpenAI

        kwargs = {"response_format": {"type": "json_object"}} if json_mode else {}
        res = OpenAI().chat.completions.create(
            model=name,
            temperature=temperature,
            max_tokens=max_tokens,
            messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
            **kwargs,
        )
        text = res.choices[0].message.content or ""
    elif provider == "anthropic":
        from anthropic import Anthropic

        if json_mode:
            system = system + "\nReply with a single JSON object and nothing else."
        res = Anthropic().messages.create(
            model=name,
            max_tokens=max_tokens,
            temperature=temperature,
            system=system,
            messages=[{"role": "user", "content": user}],
        )
        text = "".join(getattr(block, "text", "") for block in res.content)
    else:
        raise ValueError(f"MODEL must start with openai/ or anthropic/, got {model_name()}")
    return parse_json(text) if json_mode else text


def parse_json(text: str):
    """Parse a JSON object out of a reply, tolerating a ```json fence."""
    text = text.strip()
    fence = re.match(r"^```(?:json)?\s*(.*?)\s*```$", text, re.S)
    if fence:
        text = fence.group(1)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start, end = text.find("{"), text.rfind("}")
        if start >= 0 and end > start:
            return json.loads(text[start:end + 1])
        raise
