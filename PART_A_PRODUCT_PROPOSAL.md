# Coy (Fiquity Technology) — SDE Intern Assignment
# Part A: Product Teardown & Two Core Feature Proposals

**Author:** Himanshu Jha  
**Role:** Software Engineering Intern Applicant  
**Product Analyzed:** Coy (`app.getcoy.com` / `getcoy.com`)  
**Parent Entity:** Fiquity Technology Private Limited  

---

## 1. Executive Summary & App Experience Teardown

Coy is designed around a singular, high-friction human psychology problem: **the vulnerability and fear of rejection when confessing a romantic crush**. Traditional dating apps (Tinder, Bumble, Hinge) cater to strangers matching in a public catalog. Coy inverses this by focusing exclusively on **existing social circles** through a double-blind, zero-knowledge matching mechanism.

### The Walkthrough of the Existing Experience:
1. **Phone OTP Onboarding:** Frictionless authentication. Clean, minimalist Indian mobile phone OTP verification.
2. **Adding a Crush:** User inputs an existing acquaintance via mobile number or email address (first 3 free, up to 5 total).
3. **Email Verification:** Adds account recovery and security verification for notifications.
4. **The Anonymous Invite Trigger:** The recipient receives an anonymous WhatsApp / SMS notification: *"Someone has a crush on you on Coy"*.
5. **The Extra-Slots Screen:** Clear freemium upsell gate (unlocking slots 4 and 5) monetizing user intent when they have more than 3 active crushes.

### The Two Systemic Bottlenecks Identified in the Funnel:
While the core matching mechanic is mathematically elegant, the product faces two distinct conversion drop-offs:
* **Drop-off 1 (The Top-of-Funnel Recipient Friction):** When an unsuspecting recipient receives an anonymous notification from an unknown sender, skepticism is high. In the Indian market, unsolicited SMS/WhatsApp messages are often dismissed as spam or phishing. Recipients have dozens or hundreds of contacts—trying to guess who sent it without burning their 3 precious free slots creates decision paralysis.
* **Drop-off 2 (The Post-Match Freeze):** When a mutual match triggers, the platform reveals the names/numbers of both parties. However, unlike traditional apps with photo galleries, lifestyle tags, and bio prompts, there is zero conversational substrate. Users experience extreme social anxiety about who initiates the first text and what to say.

To solve both bottlenecks, I propose two high-leverage features: **Circle Hints** (solving the top-of-funnel conversion problem) and **Blind Icebreaker Cards** (solving the post-match activation problem).

---

## Feature 1: "Circle Hints" (Mutual Context Verification without Identity Leaks)

### 1. The Core Problem It Solves
When a user adds a crush, the recipient receives a generic notification:
> *"Someone has a crush on you on Coy! Sign up to see if it's mutual."*

In practice, this causes two failure modes:
1. **Spam Dismissal:** The recipient assumes it is a marketing bot or bulk scam and ignores the link.
2. **Exhaustion & Slot Hoarding:** The recipient wonders, *"Is this from my college? My internship? My high school group? A random person I met once?"* Because free slots are capped at 3, the recipient refuses to sign up because they don't want to waste slots guessing across disparate life stages.

### 2. Feature Specification
When User A adds User B's phone number, User A is prompted with an optional single-select context tag:
* `College / Campus Circle`
* `Workplace / Professional Network`
* `High School / Hometown Friend`
* `Gym / Fitness / Hobby Group`
* `Mutual Friends / Party Circle`

When the invite is dispatched via WhatsApp/SMS, the copy dynamically incorporates the verified circle:
> *"Someone from your **College / Campus Circle** has added you as their crush on Coy! Add your college crushes to see if it's a mutual match."*

### 3. Why This Feature is Crucial for Growth & Retention
1. **Dramatic Lift in Invite-to-Signup Conversion:** By anchoring the notification to a known physical or social context, the recipient's curiosity shifts from defensive skepticism (*"Is this spam?"*) to intense intrigue (*"Who in my college batch likes me?"*). Industry referral benchmarks show contextualized peer invites achieve a **3x–4x higher click-through and sign-up rate** than blind notifications.
2. **Focused Slot Utilization:** The recipient immediately opens the app and enters the 2 or 3 people they have feelings for within that exact circle. This converts passive recipients into active, engaged creators who invite others, fueling Coy's viral K-factor.
3. **Preserving the Zero-Leak Privacy Invariant:**  
   * Constraint: A hint must never narrow down the sender pool below a safe $k$-anonymity threshold (e.g., college batches typically contain hundreds of individuals).
   * Micro-circles (e.g. a 3-person team) are disallowed. The predefined tags guarantee that the sender's identity remains completely anonymous until reciprocal consent is established.

---

## Feature 2: "Blind Icebreaker Cards & WhatsApp First-Move Deep-Link"

### 1. The Core Problem It Solves
When both users reciprocally add each other, Coy declares: *"It's a Match!"*

At this precise instant, the product experience currently halts. The app reveals the match, but provides no bridge into real-world communication. The users are paralyzed:
* *"Do I WhatsApp them right now?"*
* *"What if they added me as a joke or a test?"*
* *"What do I say after months of keeping this a secret?"*

When matched users fail to message each other within the first 6 hours, the emotional momentum evaporates, leading to ghosting and leaving the user feeling that the app produced an awkward dead-end.

### 2. Feature Specification
The **Blind Icebreaker** is a playful, two-sided revelation mechanism:

#### Step A: Private Input at Crush Submission
When User A submits User B as a crush, they select and answer a lighthearted "First Move" prompt (stored encrypted and hidden until a match):
* *Prompt Options:*
  * "If this is mutual, our first hangout should be: [Coffee / Late Night Drive / Street Food / Movie]"
  * "The moment I first realized I liked you was: [Short 60-character note]"
  * "Our song or shared memory is: [Short note]"

#### Step B: The Mutual Reveal Screen
When a mutual match occurs, the "It's a Match!" screen does not just show names. It presents a dual **"Scratch-to-Reveal"** card showing both answers side-by-side:
> **You:** "Our first hangout: *Late Night Drive & Chai*"  
> **Them:** "Our first hangout: *Street Food & Boba*"

#### Step C: 1-Click WhatsApp Deep-Link
Beneath the revealed cards is a prominent action button:  
`[Open in WhatsApp with Icebreaker]`  
Clicking it opens a native `https://wa.me/<phone>?text=...` deep link with an automatic pre-composed draft:
> *"Hey! It turns out our Coy cards just matched 😄 You picked Street Food and I picked Chai. When are we going?"*

### 3. Why This Feature is Crucial for Product Success
1. **Eliminates First-Move Friction:** By providing shared context and a pre-formatted playful opening line, the psychological burden of initiation drops to near zero.
2. **Drives Word-of-Mouth Organic Virality:** When users successfully go on a date born out of a Coy match, they tell their friend circles. Dating and crush apps do not grow through paid ads; they grow through legendary success stories shared in college hostels and friend groups.
3. **Zero Security/Privacy Risk:** Answers remain AES-256 encrypted at rest and are strictly queried only upon verification of bidirectional reciprocal match records in the database. If no match occurs, the answer is permanently scrubbed when the crush expires or is removed.

---

## 3. Summary Table: Feature Impact Matrix

| Dimension | Feature 1: Circle Hints | Feature 2: Blind Icebreakers |
| :--- | :--- | :--- |
| **Funnel Stage** | Top-of-Funnel (Notification $\rightarrow$ Signup) | Bottom-of-Funnel (Match $\rightarrow$ Real World Conversation) |
| **Target Metric** | Invite Click-Through Rate & Signup Conversion | 24-Hour Message Initiation Rate & Day-30 Retention |
| **User Psychology** | Eliminates spam skepticism & fear of wasted slots | Eliminates post-match awkwardness & initiation paralysis |
| **Privacy Compliance** | Strictly maintains $k$-anonymity via broad category tags | Data revealed only after cryptographic match verification |
| **Engineering Effort** | Low (enum field on crush record + template copy updates) | Moderate (encrypted prompt fields + reveal modal + deep link) |

---
*End of Part A Proposal.*
