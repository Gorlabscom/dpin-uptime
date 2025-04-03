"use client";
// import Appbar from "@/components/Appbar";
import { Activity, Bell, Shield, Clock, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Features Section */}
      <section className="bg-gray-800 py-20" id="features">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">
            Why Choose UptimeGuard?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="bg-gray-900 p-6 rounded-lg text-lg font-bold cursor-pointer"
              onClick={() => {
                router.push("/dashboard");
              }}
            >
              Start monitoring
            </div>
            <FeatureCard
              icon={<Bell className="w-8 h-8 text-blue-500" />}
              title="Instant Alert"
              description="Get notified immediately when your services experience downtime or performance issues."
            />
            <FeatureCard
              icon={<Clock className="w-8 h-8 text-blue-500" />}
              title="24/7 Monitoring"
              description="Round-the-clock monitoring ensures your services are always performing optimally."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-blue-500" />}
              title="Secure & Reliable"
              description="Enterprise-grade security and reliability you can trust."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <StatCard number="99.9%" text="Average Uptime" />
            <StatCard number="5000+" text="Active Users" />
            <StatCard number="1M+" text="Checks Per Day" />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gray-800 py-20" id="pricing">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">
            Simple, Transparent Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
              title="Starter"
              price="$29"
              features={[
                "Up to 10 monitors",
                "5-minute check intervals",
                "Email notifications",
                "24-hour data retention",
              ]}
            />
            <PricingCard
              title="Professional"
              price="$79"
              features={[
                "Up to 50 monitors",
                "1-minute check intervals",
                "SMS & Slack notifications",
                "30-day data retention",
                "API access",
              ]}
              highlighted
            />
            <PricingCard
              title="Enterprise"
              price="Custom"
              features={[
                "Unlimited monitors",
                "30-second check intervals",
                "Custom integrations",
                "1-year data retention",
                "Dedicated support",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Activity className="w-6 h-6 text-blue-500" />
                <span className="font-bold">UptimeGuard</span>
              </div>
              <p className="text-gray-400">
                Making uptime monitoring simple and reliable for everyone.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-400">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function StatCard({ number, text }: { number: any; text: string }) {
  return (
    <div>
      <div className="text-4xl font-bold text-blue-500 mb-2">{number}</div>
      <div className="text-gray-400">{text}</div>
    </div>
  );
}

function PricingCard({ title, price, features, highlighted = false }: any) {
  return (
    <div
      className={`${highlighted ? "bg-blue-500" : "bg-gray-900"} p-8 rounded-lg relative ${highlighted ? "transform scale-105" : ""}`}
    >
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <div className="text-3xl font-bold mb-6">
        {price}
        <span className="text-lg font-normal">
          {price !== "Custom" ? "/mo" : ""}
        </span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center space-x-2">
            <Check className="w-5 h-5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button
        className={`w-full py-2 rounded-lg transition-colors ${
          highlighted
            ? "bg-white text-blue-500 hover:bg-gray-100"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        Get Started
      </button>
    </div>
  );
}
