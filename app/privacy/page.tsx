export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#111] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy for Sapiens Rank</h1>
        <p className="text-gray-400"><strong>Last Updated: 30/05/2026</strong></p>

        <p className="text-lg leading-relaxed">
          At <strong className="text-white">Sapiens Rank</strong>, we are committed to protecting your personal data and respecting your privacy.
          This Privacy Policy explains how and why we process your data when you use our app, in compliance with the General Data Protection Regulation (GDPR) and other applicable laws.
        </p>

        {/* 1. Information We Collect */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">1. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg">
            <li><strong className="text-white">Email address</strong>: Used for authentication and account management.</li>
            <li><strong className="text-white">Display name</strong>: The name or username you choose during onboarding, shown on the leaderboard.</li>
            <li><strong className="text-white">Age and country</strong>: Collected during onboarding to personalise your ranking experience.</li>
            <li>
              <strong className="text-white">Health &amp; fitness data</strong>: With your explicit permission, we read the following metrics from Apple HealthKit:
              resting heart rate, heart rate variability (HRV), sleep duration and stages, daily steps, active calories burned, and stand hours.
              These data points are <strong className="text-white">processed entirely on your device</strong> to compute a daily score (an integer from 0 to 100).
              Only this computed score — never the raw health data — is transmitted to our servers.
            </li>
            <li><strong className="text-white">Device token</strong>: A Firebase Cloud Messaging (FCM) token, stored to send you push notifications if you grant permission.</li>
            <li><strong className="text-white">User identifier</strong>: A pseudonymous UUID assigned by our authentication provider (Supabase) to link your profile and scores.</li>
          </ul>
        </section>

        {/* 2. How We Use Your Data */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">2. How We Use Your Data</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg">
            <li><strong className="text-white">Authentication</strong>: To create and secure your account.</li>
            <li><strong className="text-white">Score calculation</strong>: To compute your daily wellness score from your HealthKit data, entirely on-device.</li>
            <li><strong className="text-white">Leaderboard</strong>: To display your rank alongside other users (by display name and country).</li>
            <li><strong className="text-white">Push notifications</strong>: To send you daily reminders or rank updates, if you opt in.</li>
          </ul>
          <p className="text-lg leading-relaxed">
            We do <strong className="text-white">not</strong> use your data for advertising, profiling, or any purpose other than providing the core features of the app.
          </p>
        </section>

        {/* 3. Health Data */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">3. Health Data</h2>
          <p className="text-lg leading-relaxed">
            Sapiens Rank accesses Apple HealthKit data solely to calculate your daily wellness score on your device.
            Raw health metrics are <strong className="text-white">never uploaded to our servers</strong> and are never shared with third parties.
            You can revoke HealthKit access at any time in <strong className="text-white">Settings → Privacy &amp; Security → Health → Sapiens Rank</strong>.
          </p>
        </section>

        {/* 4. Third-Party Services */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">4. Third-Party Services</h2>
          <p className="text-lg leading-relaxed">We use the following trusted processors to deliver our service:</p>
          <ul className="list-disc pl-6 space-y-3 text-lg">
            <li>
              <strong className="text-white">Supabase</strong>: Our backend provider. Stores your profile (name, age, country), daily scores, and device token.
              Data is hosted in the EU. See{" "}
              <a href="https://supabase.com/privacy" className="text-blue-400 hover:text-blue-300" target="_blank" rel="noopener noreferrer">Supabase's Privacy Policy</a>.
            </li>
            <li>
              <strong className="text-white">Firebase Cloud Messaging (Google)</strong>: Used exclusively to deliver push notifications.
              Only your FCM device token is shared with Firebase; no personal data or health data is involved.
              See{" "}
              <a href="https://firebase.google.com/support/privacy" className="text-blue-400 hover:text-blue-300" target="_blank" rel="noopener noreferrer">Firebase's Privacy Policy</a>.
            </li>
          </ul>
          <p className="text-lg leading-relaxed">
            These providers act on our behalf and <strong className="text-white">do not use your data for advertising or profiling</strong>.
          </p>
        </section>

        {/* 5. Legal Basis */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">5. Legal Basis for Processing</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg">
            <li><strong>Contract</strong>: To provide core services (account, leaderboard, score calculation).</li>
            <li><strong>Consent</strong>: For optional features — HealthKit access and push notifications. You may withdraw consent at any time.</li>
            <li><strong>Legitimate interests</strong>: To maintain the security and integrity of our platform.</li>
          </ul>
        </section>

        {/* 6. Data Retention */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">6. Data Retention</h2>
          <p className="text-lg leading-relaxed">
            Account and score data is retained while your account is active.<br />
            Device tokens are refreshed automatically and deleted when you uninstall the app or revoke notification permissions.<br />
            You may request deletion of your account and all associated data at any time.
          </p>
        </section>

        {/* 7. International Transfers */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">7. International Data Transfers</h2>
          <p className="text-lg leading-relaxed">
            Firebase (Google) may process data outside the European Economic Area (EEA).
            Where this occurs, we ensure appropriate safeguards such as the European Commission's Standard Contractual Clauses are in place to protect your data.
          </p>
        </section>

        {/* 8. Your Rights */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">8. Your Rights</h2>
          <p className="text-lg leading-relaxed">Under GDPR, you have the following rights:</p>
          <ul className="list-disc pl-6 space-y-3 text-lg">
            <li><strong>Access</strong> – to know what data we hold about you.</li>
            <li><strong>Rectification</strong> – to correct inaccurate information.</li>
            <li><strong>Erasure</strong> – to request deletion of your data.</li>
            <li><strong>Restriction</strong> – to limit certain processing.</li>
            <li><strong>Data Portability</strong> – to receive a copy of your data in a machine-readable format.</li>
            <li><strong>Objection</strong> – to object to processing based on legitimate interests.</li>
            <li><strong>Withdrawal of Consent</strong> – at any time, for consent-based processing (HealthKit, notifications).</li>
          </ul>
          <p className="text-lg leading-relaxed">
            To exercise your rights, contact us at{" "}
            <a href="mailto:contact@pommef.com" className="text-blue-400 hover:text-blue-300">contact@pommef.com</a>.
            You also have the right to lodge a complaint with your local Data Protection Authority.
          </p>
        </section>

        {/* 9. Security */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">9. Security</h2>
          <p className="text-lg leading-relaxed">
            We implement technical and organisational measures to protect your personal data, including encryption in transit (TLS),
            row-level security on our database, and secure authentication via Supabase Auth.
          </p>
        </section>

        {/* 10. Children's Privacy */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">10. Children's Privacy</h2>
          <p className="text-lg leading-relaxed">
            Our app is not intended for children under 13. We do not knowingly collect data from children.
            If you believe we have collected data from a child, please contact us and we will delete it promptly.
          </p>
        </section>

        {/* 11. Push Notifications */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">11. Push Notifications</h2>
          <p className="text-lg leading-relaxed">
            With your consent, we may send push notifications (e.g. daily score reminders, rank changes).
            You can manage or disable these at any time in your device settings.
          </p>
        </section>

        {/* 12. Changes */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">12. Changes to This Policy</h2>
          <p className="text-lg leading-relaxed">
            We may update this Privacy Policy when necessary.
            Any updates will be posted here with a revised "Last Updated" date.
            Where required by law, we will notify you of significant changes in-app.
          </p>
        </section>

        {/* 13. Contact */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">13. Contact Us</h2>
          <p className="text-lg leading-relaxed">
            If you have any questions about this Privacy Policy or your data rights, please contact us:
          </p>
          <p className="text-lg leading-relaxed">
            <strong className="text-white">Email</strong>:{" "}
            <a href="mailto:contact@pommef.com" className="text-blue-400 hover:text-blue-300">contact@pommef.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
