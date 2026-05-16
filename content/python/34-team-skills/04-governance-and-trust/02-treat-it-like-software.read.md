---
xp: 1
estSeconds: 150
concept: skill-trust
---

# Treat a skill like software you're installing

Here's the single most useful rule for skill governance:

> Installing a skill deserves the same caution as installing software
> on an important computer.

You already have instincts about installing software. You don't install
a random program a stranger emailed you onto the company's systems. You
check where it came from. You ask whether the source is trusted. For
anything sensitive, someone reviews it first. Apply those exact
instincts to skills.

## Where did this skill come from

Every skill falls into one of three trust levels:

- **Built in-house, by someone accountable.** Your own legal manager
  wrote the contract-review skill. Highest trust, though it still gets
  evaluated (next step).
- **From a known, reputable source.** A skill from Anthropic's own
  catalog or a vendor you have a real relationship with. Reasonable
  trust, still review it.
- **From an untrusted or unknown source.** A skill from the open
  internet, a stranger, a source you can't vouch for. Treat this the
  way you'd treat a stranger's executable file. Do not deploy it to a
  team without a full audit by someone who can actually read what it
  does, and when in doubt, don't deploy it at all.

## Why this matters more than it seems

The open standard behind skills means skills are portable and easy to
share, which is genuinely good. It also means skills travel, and a
skill that shows up from somewhere convenient is not automatically a
skill that's safe. Convenience of sharing and trustworthiness of source
are two separate things. The team that keeps them separate, and checks
the source every time, is the team skills make stronger instead of more
exposed.
