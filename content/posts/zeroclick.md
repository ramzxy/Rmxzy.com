---
title: Hacking my Student housing website
date: 2025-01-26
description: My student housing portal returned the magic login link in its own API response. With nothing but an email address, that was enough to take over an account.
keywords: zero click, account takeover, IDOR, broken access control, web hacking, security research, Ilia Mirzaali, rmxzy
author: Ilia Mirzaali
tags:
    - "WebHacking"
thumbnail: /images/student-housing-cover-v3.png
accent: "#d04d38"
categories:
  - Security
---
# Overview  
**Vulnerability Name:** Zero Click Account Take Over using IDOR and Improper Access Control  
**Impact Level:** Critical  
**Affected System/URL:** [REDACTED] 
**Description:**  
This vulnerability allows an attacker to take over a user's account without any interaction from the victim, requiring only their email address. By exploiting improper access controls and leveraging an Insecure Direct Object Reference (IDOR), the attacker can retrieve and use the magic login link sent in the server's response to the user's login request.  

## Discovery and Background  

Last week, I discovered a critical vulnerability on the Plaza Residence Services website that led to a **zero-click account takeover** by simply knowing the user's email address. This research was conducted strictly for **educational and ethical purposes**, and the company's IT department was notified immediately upon discovery.  

Hopefully, by the time you read this blog, the security vulnerability has been patched.  


## Technical Details  

### **How the Vulnerability Works**  
The vulnerability lies in the website's **magic login function**, which sends a magic login link as part of the server's response to a POST request when the user logs in. Here's how the attack works:  

1. An attacker makes a POST request to the login endpoint (e.g., `/portal/rest/frontend/json/account/frontend/requestMagicLink`) with the victim's email address.  
2. The server responds with the magic login link in the response body, without verifying whether the request was authorized.  
3. The attacker extracts the link from the response and uses it to log in as the victim without requiring any further interaction or confirmation from the user.  

---

### **Proof of Concept (PoC)**  
#### **Steps to Reproduce:**  
1. **Send a POST request to the login endpoint:**  
   ```http
    POST /portal/rest/frontend/json/account/frontend/requestMagicLink?lang=en HTTP/2  
    Host: [example.com]  
    Accept: application/json, text/plain, */*  
    Content-Type: application/json;charset=UTF-8   

    "[victim@example.com]"  //sent as plain text
    ```

2. **View server's response:**
   
    The server responds with a json containing info on the user including an attribute called link with the magic login link.
    ```json
    "link":"https:\/\/[REDACTED].com\/en\/translate-to-engels-inloggen\/magic-link#?hash=[login_hash]"
    ```

3. **Use the magic link:**
    
    Simply paste the link on the browser and boom you are in.

## Root Cause Analysis
**The root cause of the vulnerability is a combination of:**
1.	**Improper Access Control:** The server does not verify whether the POST request for the magic link is made by an authorized user.
2.	**Exposed Sensitive Data:** The magic login link is included in the server’s response, exposing it to potential abuse.


## Recommendations for Mitigation

To address this vulnerability, the following measures should be **implemented**:
1.	**Authorization Checks:** Ensure that only authenticated and authorized users can request the magic login link.
2.	**Token Validation:** Use cryptographically secure, short-lived tokens for generating magic links and bind them to specific IPs or sessions.
3.	**Do Not Expose Sensitive Data:** Avoid including sensitive links or tokens in API responses unless absolutely necessary.
4.	**Rate-Limiting and Monitoring:** Add rate limits to endpoints handling sensitive operations and monitor them for suspicious activity.

## Conclusion 

I hope this writeup was usuful and educational(altough very basic). For more queries and questions you know where to find me :)
