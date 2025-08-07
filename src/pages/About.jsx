import React, { useEffect } from "react";
import Header from "../components/Header";
import { Users, BadgeCheck, Tv, ShieldCheck, Smile } from "lucide-react";
import siteConfig from "../config/siteConfig";
import { updatePageSEO } from "../utils/seoUtils";

const About = () => {
  useEffect(() => {
    // Update SEO for about page
    updatePageSEO('about');
  }, []);

  return (
    <div>
      <Header />
      <main className="container mx-auto mt-12 px-4 py-12">
        <section className="text-center mb-16">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">About Us</h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Welcome to <span className="font-semibold ">{siteConfig.siteName}</span> — the
            leading SMM panel trusted by thousands. For over two years, we've
            been empowering brands, influencers, and businesses with real
            followers, active subscribers, and premium OTT services that drive
            real results.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
            Our Mission
          </h2>
          <p className="text-sm text-gray-700 max-w-3xl mx-auto text-center">
            To deliver authentic, high-quality social media marketing services
            that fuel genuine engagement. From social media to premium OTT, we
            're committed to your digital success.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-5 rounded-xl  text-center">
              <Users className="mx-auto text-green-600 mb-3" size={32} />
              <h3 className="font-bold text-gray-800 mb-2">
                Real & Authentic Growth
              </h3>
              <p className="text-sm text-gray-600">
                100% real followers & subscribers. No bots. Just genuine
                engagement that builds credibility and trust.
              </p>
            </div>
            <div className="bg-green-50 p-5 rounded-xl  text-center">
              <BadgeCheck className="mx-auto text-green-600 mb-3" size={32} />
              <h3 className="font-bold text-gray-800 mb-2">
                Two Years of Excellence
              </h3>
              <p className="text-sm text-gray-600">
                Trusted by thousands for consistent, high-quality service
                delivery across platforms.
              </p>
            </div>
            <div className="bg-green-50 p-5 rounded-xl  text-center">
              <Tv className="mx-auto text-green-600 mb-3" size={32} />
              <h3 className="font-bold text-gray-800 mb-2">
                Comprehensive OTT Services
              </h3>
              <p className="text-sm text-gray-600">
                Premium OTT services tailored to amplify your digital reach with
                seamless access and support.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
            Our Commitment to You
          </h2>
          <div className="max-w-3xl mx-auto text-center">
            <ShieldCheck className="mx-auto text-green-600 mb-3" size={32} />
            <p className="text-sm text-gray-700">
              Transparency, quality, and satisfaction — our core values. Our
              24/7 support, fast delivery, and dedication make us the partner
              you can count on for digital success.
            </p>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Join Thousands of Happy Customers
          </h2>
          <Smile className="mx-auto text-green-600 mb-3" size={32} />
          <p className="text-sm text-gray-700 max-w-xl mx-auto mb-6">
            From startups to influencers, our clients trust us for results that
            drive real growth. Ready to scale up your online presence?
          </p>
          <a
            href="/"
            className="inline-block bg-green-500 text-white font-medium py-2 px-5 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Get Started Now
          </a>
        </section>
      </main>
    </div>
  );
};

export default About;