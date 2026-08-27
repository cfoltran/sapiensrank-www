import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#111] text-white">
      <Header />
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-12 space-y-8">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy for Sapiens Rank</h1>
        <p className="text-gray-400"><strong>Last Updated: 27/08/2026</strong></p>

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
              <strong className="text-white">Health &amp; fitness data</strong>: With your explicit permission, we read the following metrics from Apple Health (HealthKit) on iOS or Android Health Connect on Android:
              heart rate variability (HRV), resting heart rate, sleep duration, daily steps, active calories burned, stand hours, and exercise minutes.
              We also read your recorded workouts (activity type, start time, duration, distance, and calories burned).
              Your daily score (an integer from 0 to 100) is computed <strong className="text-white">on your device</strong> from these metrics.
              The underlying daily metric values and workout entries are then stored on our servers (Supabase, hosted in the EU) to power the leaderboard,
              guild territory battles, and future recalculation of your score. They are held under row-level security, so that only you can access them in full,
              and other players can only see the limited, aggregated form described in Sections 2 and 3.
            </li>
            <li><strong className="text-white">Profile photo</strong>: If you choose to upload an avatar, it is stored in our storage (Supabase) and shown publicly next to your name on the leaderboard and on your profile. Providing a photo is optional.</li>
            <li><strong className="text-white">Guild membership</strong>: If you join or create a guild, your guild affiliation, role, and the territories your guild holds are stored to run the team and territory-battle features.</li>
            <li><strong className="text-white">Guild chat messages</strong>: If you join a guild, the messages you send in your guild's chat are stored on our servers (Supabase, hosted in the EU) and delivered to the other members of your guild. They are visible only to members of your guild, and are automatically deleted after 90 days. Please do not share sensitive personal information in chat.</li>
            <li><strong className="text-white">Moderation data</strong>: If you block another user or report a message, we store that action (who blocked or reported which message, and any reason you provide) to keep the community safe and to review reported content. Blocking a user hides their messages from you and stops their push notifications reaching you.</li>
            <li><strong className="text-white">Device token</strong>: A Firebase Cloud Messaging (FCM) token, stored to send you push notifications if you grant permission.</li>
            <li><strong className="text-white">User identifier</strong>: A pseudonymous UUID assigned by our authentication provider (Supabase) to link your profile and scores.</li>
            <li><strong className="text-white">Sign-in provider data</strong>: You can create your account with an email address, or with Sign in with Apple (iOS) or Google Sign-In (Android). When you use Apple or Google to sign in, that provider confirms your identity to us and we receive the email address associated with your account (Apple may relay a private, anonymised address).</li>
            <li><strong className="text-white">Usage &amp; analytics data</strong>: To understand how the app is used and to improve it, we collect product-analytics events via PostHog (for example onboarding progress, a sync event that includes your daily score, and guild/territory actions), linked to your pseudonymous user identifier. Analytics are hosted in the EU and are never used for advertising.</li>
          </ul>
        </section>

        {/* 2. How We Use Your Data */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">2. How We Use Your Data</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg">
            <li><strong className="text-white">Authentication</strong>: To create and secure your account.</li>
            <li><strong className="text-white">Score calculation</strong>: To compute your daily wellness score from your HealthKit data on your device, and to store your daily metric values so scores can be recalculated if the scoring formula changes.</li>
            <li><strong className="text-white">Leaderboard</strong>: To display your rank alongside other users (by display name and country).</li>
            <li>
              <strong className="text-white">Metric comparison</strong>: When another player views your profile, we show a 7-day average of your <strong className="text-white">steps, active calories, stand hours, and exercise minutes</strong> next to their own.
              Your <strong className="text-white">sleep and HRV averages remain visible only to you</strong> and are never shown to other players.
            </li>
            <li>
              <strong className="text-white">Guilds &amp; territory battles</strong>: If you belong to a guild, your raw values for the metric chosen in a battle (steps, sleep, calories, or stand hours) are summed with your teammates' over the 24-hour battle window to decide which guild wins a territory. Individual values are not shown to opposing players; only the team total is used.
            </li>
            <li><strong className="text-white">Guild chat</strong>: To deliver the messages you send to the other members of your guild, and to notify them via push notification if they have opted in.</li>
            <li><strong className="text-white">Moderation &amp; safety</strong>: To operate blocking and reporting, review reported messages, and remove content or users that violate our Terms. We act on reports of objectionable content within 24 hours.</li>
            <li><strong className="text-white">Push notifications</strong>: To send you daily reminders or rank updates, if you opt in.</li>
            <li><strong className="text-white">Product analytics</strong>: To measure feature usage and improve the app, using pseudonymous event data via PostHog (hosted in the EU).</li>
          </ul>
          <p className="text-lg leading-relaxed">
            We do <strong className="text-white">not</strong> use your data for advertising, and we never sell it. Beyond operating the app's core features, the only additional use is the limited, pseudonymous product analytics described above, which we use solely to understand usage and improve the app.
          </p>
        </section>

        {/* 3. Health Data */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">3. Health Data</h2>
          <p className="text-lg leading-relaxed">
            Your daily wellness score is calculated from Apple Health (HealthKit) or Android Health Connect data on your device. The underlying daily metric values
            (HRV, resting heart rate, sleep, steps, active calories, stand hours, exercise minutes) and your recorded workouts (type, duration, distance, calories) are then stored on our servers (Supabase, hosted in the EU),
            protected by row-level security so that, by default, only you can read your own data.
          </p>
          <p className="text-lg leading-relaxed">
            We use this data <strong className="text-white">only</strong> to operate the app's features (scoring, leaderboard, guild territory battles) and to recalculate scores if our formula changes.
            We <strong className="text-white">never sell it, never share it with third parties for advertising, and never use it for profiling</strong>.
            The only way another user sees any of it is in the limited, aggregated form described in Section 2:
            a 7-day average of your steps, calories, stand hours and exercise minutes, plus a team total during a guild battle.
            Your <strong className="text-white">sleep and HRV are never exposed to other users</strong>.
          </p>
          <p className="text-lg leading-relaxed">
            You can revoke health access at any time: on iOS in <strong className="text-white">Settings → Privacy &amp; Security → Health → Sapiens Rank</strong>,
            and on Android in the <strong className="text-white">Health Connect</strong> app under app permissions.
            You can also request deletion of all stored metric data at any time (see Sections 6 and 8).
          </p>
        </section>

        {/* 4. Third-Party Services */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">4. Third-Party Services</h2>
          <p className="text-lg leading-relaxed">We use the following trusted processors to deliver our service:</p>
          <ul className="list-disc pl-6 space-y-3 text-lg">
            <li>
              <strong className="text-white">Supabase</strong>: Our backend and authentication provider. Stores your profile (name, age, country, and profile photo if you upload one), daily scores, daily health metric values, workout entries, guild membership, and device token.
              Data is hosted in the EU. See{" "}
              <a href="https://supabase.com/privacy" className="text-blue-400 hover:text-blue-300" target="_blank" rel="noopener noreferrer">Supabase's Privacy Policy</a>.
            </li>
            <li>
              <strong className="text-white">PostHog</strong>: Our product-analytics provider. Receives pseudonymous usage events (linked to your user identifier) to help us understand how the app is used and improve it.
              Data is hosted in the EU. See{" "}
              <a href="https://posthog.com/privacy" className="text-blue-400 hover:text-blue-300" target="_blank" rel="noopener noreferrer">PostHog's Privacy Policy</a>.
            </li>
            <li>
              <strong className="text-white">Firebase Cloud Messaging (Google)</strong>: Used exclusively to deliver push notifications.
              Only your FCM device token is shared with Firebase; no personal data or health data is involved.
              See{" "}
              <a href="https://firebase.google.com/support/privacy" className="text-blue-400 hover:text-blue-300" target="_blank" rel="noopener noreferrer">Firebase's Privacy Policy</a>.
            </li>
            <li>
              <strong className="text-white">Apple &amp; Google (sign-in)</strong>: If you choose Sign in with Apple (iOS) or Google Sign-In (Android), that provider authenticates you and confirms your identity to us. No health data is shared with them.
              See{" "}
              <a href="https://www.apple.com/legal/privacy/" className="text-blue-400 hover:text-blue-300" target="_blank" rel="noopener noreferrer">Apple's Privacy Policy</a>{" "}
              and{" "}
              <a href="https://policies.google.com/privacy" className="text-blue-400 hover:text-blue-300" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>.
            </li>
          </ul>
          <p className="text-lg leading-relaxed">
            These providers act as processors on our behalf and <strong className="text-white">do not use your data for advertising or profiling</strong>.
          </p>
        </section>

        {/* 5. Legal Basis */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">5. Legal Basis for Processing</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg">
            <li><strong>Contract</strong>: To provide core services (account, leaderboard, guilds, guild chat, score calculation).</li>
            <li><strong>Explicit consent</strong>: Health &amp; fitness data is a special category of personal data under Article 9 GDPR. We process it, store it, and display it to other players in aggregated form only on the basis of your explicit consent, given when you grant HealthKit access. You may withdraw this consent at any time by revoking HealthKit access, which stops further collection.</li>
            <li><strong>Consent</strong>: For push notifications. You may withdraw consent at any time.</li>
            <li><strong>Legitimate interests</strong>: To maintain the security and integrity of our platform, to moderate guild chat (operate blocking and reporting, review reported content, and remove objectionable content and abusive users), and to run pseudonymous product analytics to understand usage and improve the app. You may object to this processing at any time (see Section 8).</li>
          </ul>
        </section>

        {/* 6. Data Retention */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">6. Data Retention</h2>
          <p className="text-lg leading-relaxed">
            Account, score, and daily health metric data is retained while your account is active.<br />
            Guild chat messages are automatically deleted 90 days after they are sent.<br />
            Moderation records (blocks and reports) are retained while your account is active to keep the community safe.<br />
            Device tokens are refreshed automatically and deleted when you uninstall the app or revoke notification permissions.<br />
            You may request deletion of your account and all associated data, including your stored health metrics, at any time.
          </p>
        </section>

        {/* 7. International Transfers */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">7. International Data Transfers</h2>
          <p className="text-lg leading-relaxed">
            Our core data (Supabase) and analytics (PostHog) are hosted in the EU. However, some providers, such as Firebase and Google Sign-In (Google) or Sign in with Apple (Apple), may process certain data (such as your device token or authentication identity) outside the European Economic Area (EEA).
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
      <Footer />
    </div>
  );
}
