import { AlertTriangle, Info, Truck, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const NonShippingCountriesPage = () => {
  const restrictedCountries = [
    "Antarctica",
    "Bouvet Island",
    "British Indian Ocean Territory",
    "Clipperton Island",
    "Cuba",
    "French Southern and Antarctic Lands",
    "Greenland",
    "Heard Island and McDonald Islands",
    "India",
    "Iran",
    "New Caledonia",
    "North Korea",
    "Pitcairn Islands",
    "Sudan",
    "Syria",
    "Tokelau",
    "Western Sahara",
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shipping Restrictions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Currently, we are unable to ship to the following countries and
            territories
          </p>
        </div>

        {/* US Shipping Alert */}
        <Alert className="mb-4 bg-cyan-50 border-cyan-200">
          <DollarSign className="h-5 w-5 text-cyan-600" />
          <AlertTitle className="text-cyan-800">
            United States Shipping Fee
          </AlertTitle>
          <AlertDescription className="text-cyan-700">
            Due to recent tariff changes, we now charge a $4.99 shipping fee for
            all orders to the United States. We source many of our products from
            international suppliers, and these new tariffs have directly
            impacted our shipping costs.
          </AlertDescription>
        </Alert>

        {/* Free Shipping Alert */}
        <Alert className="mb-4 bg-green-50 border-green-200">
          <Truck className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-800">
            Free Shipping for Most Countries
          </AlertTitle>
          <AlertDescription className="text-green-700">
            We offer free shipping to all other eligible countries not listed in
            our restrictions below. Delivery times typically range from 7-16
            business days, depending on your location and product availability.
          </AlertDescription>
        </Alert>

        {/* Main Alert */}
        <Alert className="mb-8 bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <AlertTitle className="text-yellow-800">
            Shipping Restrictions
          </AlertTitle>
          <AlertDescription className="text-yellow-700">
            Due to various international regulations and shipping constraints,
            we cannot currently deliver to these locations.
          </AlertDescription>
        </Alert>

        {/* Restricted Countries Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {/* <AlertTriangle className="h-10 w-10 sm:h-5 sm:w-5 text-red-500" /> */}
              Countries & Territories We Don&apos;t Ship To
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {restrictedCountries.map((country) => (
                <div
                  key={country}
                  className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <span className="text-gray-700">{country}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-cyan-500" />
              Shipping Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Our Shipping Policy</h3>
                <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-600">
                  <li>Free shipping available for most eligible countries</li>
                  <li>
                    $4.99 shipping fee for United States (due to recent tariff
                    changes)
                  </li>
                  <li>Delivery times: 7-16 business days</li>
                  <li>Tracking number provided for all orders</li>
                  <li>
                    Delivery time varies based on:
                    <ul className="list-circle pl-5 mt-1 space-y-1">
                      <li>Your location</li>
                      <li>Product availability</li>
                      <li>Local customs processing</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">
                  What if my country isn&apos;t listed?
                </h3>
                <p className="text-gray-600">
                  If your country is not listed in the restricted locations
                  above, good news! We can ship to you. For most countries,
                  shipping is completely free. For United States destinations,
                  there is a $4.99 shipping fee due to recent tariff changes.
                  We&apos;ll deliver your items within 7-16 business days.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NonShippingCountriesPage;
