import Header from "../components/Header";
import Footer from "../components/Footer";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#111] text-white">
      <Header />
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-12 space-y-8">
        <h1 className="text-4xl font-bold mb-4">Terms &amp; Conditions for Sapiens Rank</h1>
        <p className="text-gray-400"><strong>Last Updated: 30/05/2026</strong></p>

        <p className="text-lg leading-relaxed">
          Welcome to <strong className="text-white">Sapiens Rank</strong>.
          By downloading, accessing, or using the Sapiens Rank app, you agree to these Terms &amp; Conditions.
          Please read them carefully, as they outline your rights and obligations when using our service.
        </p>

        {/* 1. Eligibility */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">1. Eligibility</h2>
          <p className="text-lg leading-relaxed">
            You must be at least 13 years old to use Sapiens Rank. By creating an account, you confirm that you meet this requirement.
            If you are under 18, you may only use the app with the consent of a parent or guardian.
          </p>
        </section>

        {/* 2. Account Registration */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">2. Account Registration</h2>
          <p className="text-lg leading-relaxed">
            To use Sapiens Rank, you must create an account using your email address (via Supabase Auth).
            You are responsible for maintaining the confidentiality of your login credentials and for all activity occurring under your account.
            Please notify us immediately if you suspect unauthorised access to your account.
          </p>
        </section>

        {/* 3. Use of the Service */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">3. Use of the Service</h2>
          <p className="text-lg leading-relaxed">
            Sapiens Rank is a wellness app that uses your health data (read from Apple HealthKit with your permission) to compute a daily
            wellness score and rank you against other users on a leaderboard. You agree to use the app only for personal,
            non-commercial purposes and to provide accurate information during onboarding.
            You must not attempt to manipulate your score, exploit the service, or interfere with other users' experience.
          </p>
        </section>

        {/* 4. Health Data */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">4. Health Data</h2>
          <p className="text-lg leading-relaxed">
            Sapiens Rank requests access to Apple HealthKit data (including steps, sleep, heart rate, HRV, calories, and stand hours)
            solely to calculate your daily wellness score. This processing happens entirely on your device —
            raw health data is never transmitted to our servers.
          </p>
          <p className="text-lg leading-relaxed">
            The scores computed from your health data are indicative and intended for personal motivation only.
            They do <strong className="text-white">not</strong> constitute medical advice, diagnosis, or treatment.
            Always consult a qualified healthcare professional for medical concerns.
          </p>
          <p className="text-lg leading-relaxed">
            You may revoke HealthKit access at any time in <strong className="text-white">Settings → Privacy &amp; Security → Health → Sapiens Rank</strong>.
          </p>
        </section>

        {/* 5. Leaderboard & User Content */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">5. Leaderboard &amp; User Content</h2>
          <p className="text-lg leading-relaxed">
            Your display name, country, and daily score are visible to other users on the public leaderboard.
            By creating an account, you consent to this public display.
            You are responsible for the display name you choose — it must not be offensive, misleading, or infringe third-party rights.
            We reserve the right to remove or modify any display name that violates these Terms.
          </p>
        </section>

        {/* 6. Push Notifications */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">6. Push Notifications</h2>
          <p className="text-lg leading-relaxed">
            With your consent, we may send push notifications such as daily score reminders or rank updates.
            You can disable notifications at any time in your device settings.
          </p>
        </section>

        {/* 7. Intellectual Property */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">7. Intellectual Property</h2>
          <p className="text-lg leading-relaxed">
            The Sapiens Rank app, including its design, branding, algorithms, and underlying software, is the property of Sapiens Rank and its licensors.
            You are granted a limited, non-exclusive, non-transferable, revocable licence to use the app for personal, non-commercial purposes.
            You may not copy, reproduce, distribute, reverse engineer, or create derivative works without prior written permission.
          </p>
        </section>

        {/* 8. Disclaimer & Limitation of Liability */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">8. Disclaimer &amp; Limitation of Liability</h2>
          <p className="text-lg leading-relaxed">
            Sapiens Rank is provided "as is," without warranties of any kind. We do not guarantee that the service will be continuous,
            error-free, or accurate. Wellness scores are for informational and motivational purposes only and do not constitute medical advice.
          </p>
          <p className="text-lg leading-relaxed">
            To the fullest extent permitted by law, Sapiens Rank and its operators shall not be liable for any indirect, incidental,
            or consequential damages arising from your use of the app or reliance on any score or ranking displayed.
          </p>
        </section>

        {/* 9. Termination */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">9. Termination</h2>
          <p className="text-lg leading-relaxed">
            You may delete your account at any time, which will result in the deletion of your profile and associated scores.
            Sapiens Rank reserves the right to suspend or terminate any account that violates these Terms or that poses a risk
            to the integrity of the platform or its community.
          </p>
        </section>

        {/* 10. Governing Law */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">10. Governing Law &amp; Jurisdiction</h2>
          <p className="text-lg leading-relaxed">
            These Terms are governed by the laws of France, where Sapiens Rank is based.
            Any disputes shall be subject to the exclusive jurisdiction of the competent courts in France.
          </p>
        </section>

        {/* 11. Changes to Terms */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">11. Changes to These Terms</h2>
          <p className="text-lg leading-relaxed">
            We may update these Terms &amp; Conditions from time to time. Updates will be posted here with a new "Last Updated" date.
            Continued use of Sapiens Rank after changes constitutes your acceptance of the updated Terms.
          </p>
        </section>

        {/* 12. Contact */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">12. Contact Us</h2>
          <p className="text-lg leading-relaxed">
            If you have any questions or concerns about these Terms &amp; Conditions, please contact us at:
          </p>
          <p className="text-lg leading-relaxed">
            <strong className="text-white">Email:</strong>{" "}
            <a href="mailto:contact@pommef.com" className="text-blue-400 hover:text-blue-300">contact@pommef.com</a>
          </p>
        </section>

        {/* 13. EULA */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">13. End User License Agreement (EULA)</h2>
          <p className="text-lg leading-relaxed">
            This End User License Agreement ("Agreement") is a binding contract between you ("User") and Sapiens Rank.
            By installing or using the app, you agree to comply with this Agreement. If you do not agree, do not use the app.
          </p>
          <p className="text-lg leading-relaxed">
            Sapiens Rank grants you a limited, non-exclusive, non-transferable, revocable licence to use the app for personal,
            non-commercial purposes in accordance with these Terms. You may not modify, distribute, reverse engineer, or exploit any part of the app.
          </p>
          <p className="text-lg leading-relaxed">
            There is zero tolerance for abusive behaviour. Users must not choose display names or engage in any conduct that is unlawful,
            harassing, defamatory, or otherwise inappropriate. Violation of this policy may result in immediate termination of your account.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
}
