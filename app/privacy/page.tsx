import type { Metadata } from "next";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import styles from "./privacy.module.css";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy information for Ilia Life Pipeline Personal.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy — Ilia Life Pipeline Personal",
    description: "How the private life-management automation uses Google Calendar data.",
    url: "/privacy",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#privacy-content">
        Skip to privacy information
      </a>
      <SiteHeader />

      <main id="privacy-content" className={styles.main}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>Ilia Life Pipeline Personal</p>
          <h1>Privacy</h1>
          <p className={styles.lede}>
            This is a private, single-user automation operated by Ilia Mirzaali.
            It turns personal notes into calendar actions and related life-management tasks.
          </p>
          <p className={styles.updated}>Last updated 29 August 2026</p>
        </header>

        <div className={styles.sections}>
          <section>
            <h2>Google Calendar access</h2>
            <p>
              Calendar access is used only to read availability and event details,
              and to create, update, move, or delete events requested by the operator.
            </p>
          </section>

          <section>
            <h2>Processing and sharing</h2>
            <p>
              Calendar content and note instructions may be processed by the private
              automation and its configured AI provider solely to interpret and carry
              out those instructions. Data is not sold, used for advertising, or made
              available to other users.
            </p>
          </section>

          <section>
            <h2>Storage</h2>
            <p>
              OAuth credentials and limited operational state are stored on the
              operator&apos;s private server. Calendar events remain in Google Calendar.
              Limited logs may be retained for reliability and troubleshooting.
            </p>
          </section>

          <section>
            <h2>Control</h2>
            <p>
              Google access can be revoked at any time from the Google Account&apos;s
              third-party connections page. Revoking access stops future Calendar API
              actions by the automation.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              Questions about this automation or its use of data can be sent to{" "}
              <a href="mailto:me@rmxzy.com">me@rmxzy.com</a>.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
