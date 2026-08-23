import React from "react";

import { LegalScreen } from "@/src/components/LegalScreen";

export default function PrivacyScreen() {
  return (
    <LegalScreen
      testID="privacy-policy-scroll"
      title="Privacy Policy"
      updated="22 August 2026"
      intro="CalcHub is designed to be private by default. This policy explains exactly what happens to your information when you use the app."
      sections={[
        {
          heading: "Information We Collect",
          body:
            "None. CalcHub does not collect, transmit, or sell any personal information. We do not ask you to create an account, and we do not request your name, email, phone number, contacts, location, or any device identifiers.",
        },
        {
          heading: "Information We Do NOT Collect",
          body:
            "We do not use analytics, tracking pixels, advertising SDKs, or crash-reporting services. We do not build user profiles and we do not track your activity across other apps or websites.",
        },
        {
          heading: "How Calculations Are Processed",
          body:
            "All calculations — standard, scientific, finance, and converters — run entirely on your device. Your inputs and results are never sent to any server.",
        },
        {
          heading: "Local Storage of Calculation History & Preferences",
          body:
            "Your calculation history, favorites, recently used tools, and theme preference are stored only in your device's local app storage. This data stays on your device, is not backed up to us, and can be cleared any time from Settings → Data.",
        },
        {
          heading: "Third-Party Sharing",
          body:
            "We do not share any information with third parties, because we do not collect any. The app does not make network requests for its core features; currency exchange rates are static values bundled inside the app and are clearly labelled as approximate.",
        },
        {
          heading: "Advertising",
          body:
            "CalcHub contains no advertisements and no advertising SDKs (including Google AdMob). No ad networks receive any data from this app.",
        },
        {
          heading: "Data Security",
          body:
            "Because your data never leaves your device, there is no server-side data to breach. Locally stored data is protected by your device's own security (screen lock, OS sandboxing). You remain in control of it at all times.",
        },
        {
          heading: "Children's Privacy",
          body:
            "CalcHub is a general-purpose utility and is safe for all ages. It does not knowingly collect any personal information from anyone, including children under 13.",
        },
        {
          heading: "Your Rights & Choices",
          body:
            "You can delete individual history entries, clear all history, clear recent tools, or uninstall the app at any time to remove all locally stored data. No request to us is required because we hold none of your data.",
        },
        {
          heading: "Changes to This Policy",
          body:
            "If this policy changes, the updated version will be published within the app with a new 'Last updated' date. Continued use after an update indicates acceptance of the revised policy.",
        },
        {
          heading: "Contact",
          body:
            "Questions about privacy? Contact us at: support@example.com (replace with your support email before publishing).",
        },
      ]}
    />
  );
}
