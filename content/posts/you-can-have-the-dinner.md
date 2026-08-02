---
title: You Can Have the Dinner
date: 2026-07-14 12:00:00
description: My dad bet me dinner that I couldn't hack a website while we were on holiday. The website was fine. The hospital PACS behind it was open to the internet with about 145,000 studies inside.
keywords: PACS, DICOM, medical imaging security, penetration testing, AE Title, C-ECHO, C-FIND, healthcare cybersecurity, Ilia Mirzaali, rmxzy
author: Ilia Mirzaali
tags:
    - "Security Research"
    - "DICOM"
    - "PACS"
    - "Pentesting"
thumbnail: /images/pacs-medical-imaging.webp
accent: "#c86a3b"
categories:
  - Security
---

> **Disclosure note:** Identifying details, vendor names, and accepted AE Titles are intentionally omitted.

## The Bet

Ever since I first watched *Mr. Robot*, or any hacker-related show, the coolest part has always been when someone challenges the protagonist to hack a place and they act like it isn't even a challenge. Well, last week I finally had the chance to play into that.

Almost a week into my much-needed vacation, my dad sent me a link to a website one morning. My first thought was to poke at it. Twenty minutes later, he sent me a voice message, and I was praying it would be about something interesting.

> "Hey son, can you hack this? I made a bet with the IT guy at the hospital, and he says he'll buy dinner if you manage."

That was all I needed to hear to throw everything I had at it. It was no longer about having a quick poke around. It was about maintaining the aura in front of the guy and winning my dad the bet.

## The Website Held Up

Opening the site, all I could see was a simple WordPress website for a hospital. No complicated form submissions, no login beyond the usual admin panel. Just a mostly static website. In all honesty, this broke my spirit a bit. There are only so many ways into a current WordPress installation, and exhausting each one made the playing field smaller.

I checked the `wp-admin` directory, ran a few credential checks, and kept WPScan going on the side. After a bit of digging, I found a valid administrative username. I went over every plugin and theme the site exposed, but everything was up to date and I couldn't find a known exploit that applied. The public website held up.

The only obvious option left was a password audit against the admin user. I prepared a targeted wordlist and left a sprayer running on my Raspberry Pi back home, with a small script checking the results and notifying me if anything changed.

## Changing the Playing Field

Now all I had to do was wait. I hated that. The whole thing seemed to depend on luck. I couldn't sit there waiting to hit the brute-force lottery and then call it a "hack."

You know those movie scenes where someone pulls up all the hospital records and uses them for something nefarious later? This was my moment. The stakes were much lower, but there was still a chance it could look cool as fuck. Thinking like a hacker is about not letting the cards in your hand dictate the ending. When I ran out of cards, I decided to change the playing field.

I widened the recon beyond the website. Certificate transparency records, DNS enumeration, and a wordlist tailored to clinical infrastructure led to a subdomain called **pacs**, resolving to a separate on-premise address. It was listening on TCP port 104.

Finally, a new fight.

It wasn't a web server, and it all looked new to me, so I started researching.

## PACS on Port 104

**PACS** stands for Picture Archiving and Communication System. It stores medical imaging studies and the patient information attached to them. It doesn't use typical HTTP, either: scanners and clinical workstations communicate through **DICOM**, or Digital Imaging and Communications in Medicine. Normally, this traffic stays inside the clinical network or passes through a tightly restricted gateway with hardened authentication.

But I assume, from my wording, that you can tell what was wrong here.

## C-ECHO: The Door Was Open

To test whether a DICOM system is reachable, you can send its equivalent of a ping: a **C-ECHO** request. The request succeeded, and the association response identified the implementation as a medical imaging node from a major vendor.

| Check | Result |
| --- | --- |
| DICOM association | Accepted |
| Username and password | Not required |
| Client certificate | Not required |
| TLS encryption | Not enabled |

So yes, I could actually talk to the PACS server. That was already a massive red flag.

## C-FIND and the AE Title

Querying a DICOM service is done with **C-FIND**. When I sent the first query, the server rejected it with:

```text
Calling AE title not recognised
```

What the fuck is an AE Title?

An **AE Title**, short for Application Entity Title, is a name that identifies a DICOM node on the network. The **Calling AE Title** is the name your device presents when it connects. This PACS used those names as an allow-list, but it did not require the caller to prove that it was actually the device associated with the name. AE Titles are useful for routing and administration. **They are not credentials.**

That narrowed the problem down to guessing what name a clinical workstation might use. It sounds impossible, but a bit of research showed that common viewers and vendor workstations often use predictable default names.

Oh man, the thrill at this point was insane.

I entered one of those common workstation names and sent an empty STUDY-level query. It was accepted.

## 145,000 Studies

The query started returning:

- Patient names, IDs, and dates of birth
- Study dates and referring physicians
- Modalities and study descriptions

The archive held roughly **145,000 medical imaging studies** across tens of thousands of patients. The same DICOM workflow could also be used to request the associated images.

Fucking hell. This was pretty bad.

That was enough. I stopped there. There was no reason to collect the archive or retrieve patient images just to prove the point. I counted the results by date range, masked identifiers before recording evidence, and made no changes to the clinical system.

## You Can Have the Dinner

After I had cooled down, I collected the redacted evidence for the report and sent my dad one final message:

> You can have the dinner.
