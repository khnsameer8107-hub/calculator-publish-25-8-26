import React from "react";

import { LegalScreen } from "@/src/components/LegalScreen";

export default function TermsScreen() {
  return (
    <LegalScreen
      testID="terms-scroll"
      title="Terms & Conditions"
      updated="22 August 2026"
      intro="Please read these Terms carefully before using CalcHub. By using the app you agree to these Terms."
      sections={[
        {
          heading: "Acceptance of Terms",
          body:
            "By downloading, installing, or using CalcHub, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the app.",
        },
        {
          heading: "Use of the Calculator",
          body:
            "CalcHub is provided as a free utility for personal, non-commercial use. You may use its standard, scientific, finance, and converter tools for everyday calculations.",
        },
        {
          heading: "Accuracy & Disclaimer of Calculations",
          body:
            "While we strive for accuracy, all results are provided 'as is' for general informational purposes only. Currency rates are static and approximate, not live. Financial tools (GST, EMI, SIP, investment) use standard formulas and simplified assumptions and may not reflect real-world charges, taxes, or market conditions.",
        },
        {
          heading: "No Reliance for Critical Decisions",
          body:
            "Results should NOT be relied upon for critical financial, medical, health, engineering, legal, tax, or safety decisions without independent verification by a qualified professional. BMI and health outputs are informational and not medical advice.",
        },
        {
          heading: "User Responsibility",
          body:
            "You are responsible for the inputs you provide and for verifying results before acting on them. You agree to use the app lawfully and not to misuse or attempt to disrupt its functionality.",
        },
        {
          heading: "Limitation of Liability",
          body:
            "To the maximum extent permitted by law, the developers of CalcHub shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of, or inability to use, the app or its results.",
        },
        {
          heading: "Intellectual Property",
          body:
            "The app's name, design, and code are the property of their respective owners and are protected by applicable laws. You may not copy, redistribute, or reverse-engineer the app except as permitted by law.",
        },
        {
          heading: "Changes to the App & Terms",
          body:
            "We may update the app and these Terms from time to time to add features or fix issues. Material changes will be reflected within the app with a new 'Last updated' date.",
        },
        {
          heading: "Termination & Misuse",
          body:
            "These Terms remain in effect while you use the app. Misuse of the app may result in restricted functionality. You may stop using the app and uninstall it at any time.",
        },
        {
          heading: "Contact",
          body:
            "For questions about these Terms, please reach out to our support team using the email below.",
          email: "jarvisai9077@gmail.com",
        },
      ]}
    />
  );
}
