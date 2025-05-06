import { ArrowRight, DollarSign, Share2, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AffiliatePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Join Our Affiliate Program
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Earn up to 15% commission for every successful referral
          </p>
          <a
            href="https://mishbaby.goaffpro.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-cyan-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Join Now
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="p-6">
            <CardContent className="space-y-4">
              <DollarSign className="w-12 h-12 text-cyan-600" />
              <h3 className="text-xl font-semibold">Generous Commission</h3>
              <p className="text-gray-600">
                Earn 15% commission on every successful referral purchase
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="space-y-4">
              <Share2 className="w-12 h-12 text-cyan-600" />
              <h3 className="text-xl font-semibold">Exclusive Discount Code</h3>
              <p className="text-gray-600">
                Share your unique 15% discount code with your audience
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="space-y-4">
              <Award className="w-12 h-12 text-cyan-600" />
              <h3 className="text-xl font-semibold">Easy to Join</h3>
              <p className="text-gray-600">
                Simple registration process and dedicated support
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-cyan-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold">Sign Up</h3>
              <p className="text-gray-600">
                Register for our affiliate program
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-cyan-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold">Share</h3>
              <p className="text-gray-600">
                Share your unique discount code with your audience
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-cyan-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold">Earn</h3>
              <p className="text-gray-600">
                Earn 15% commission on every successful purchase
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-8">Ready to Start Earning?</h2>
        <a
          href="https://mishbaby.goaffpro.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-cyan-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-cyan-700 transition-colors"
        >
          Join Our Affiliate Program
          <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
};

export default AffiliatePage;
