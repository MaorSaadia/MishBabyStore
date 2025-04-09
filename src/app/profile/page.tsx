import Link from "next/link";
import { members } from "@wix/members";
import { CalendarDays, User, Mail, Phone, ShoppingBag } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { wixClientServer } from "@/lib/wixClientServer";
import { updateUser } from "@/lib/actions";
import UpdateButton from "@/components/UpdateButton";

const ProfilePage = async () => {
  const wixClient = await wixClientServer();
  let user;

  try {
    user = await wixClient.members.getCurrentMember({
      fieldsets: [members.Set.FULL],
    });

    if (!user?.member?.contactId) {
      return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <div className="text-3xl font-bold text-gray-800">
            Please log in to view your profile
          </div>
          <Button asChild className="mt-4">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      );
    }

    // Rest of your component logic
  } catch (error) {
    console.error("Error fetching user data:", error);
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-3xl font-bold text-red-500">
          Unable to load profile
        </div>
        <p className="text-gray-600">
          Please try again later or contact support
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/">Return to Homepage</Link>
        </Button>
      </div>
    );
  }

  // Get order count for the "Order Summary" card
  const orderRes = await wixClient.orders.searchOrders({
    search: {
      filter: { "buyerInfo.contactId": { $eq: user?.member?.contactId } },
    },
  });

  // Calculate order stats
  const totalOrders = orderRes.orders.length;
  const totalSpent = orderRes.orders
    .reduce(
      (sum, order) => sum + (Number(order.priceSummary?.subtotal?.amount) || 0),
      0
    )
    .toFixed(2);

  // console.log("orderRes", JSON.stringify(orderRes, null, 2));

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            {user.member?.profile?.nickname || user.member.contact?.firstName}
          </h1>
          <p className="text-muted-foreground">
            Member since{" "}
            {user.member?._createdDate
              ? new Date(user.member._createdDate).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={18} />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your account details and personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateUser} className="space-y-6">
              <input
                type="text"
                hidden
                name="id"
                value={user?.member?.contactId}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      name="username"
                      className="pl-10"
                      defaultValue={user.member?.profile?.nickname || ""}
                      placeholder="Your username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      className="pl-10"
                      defaultValue={user.member?.loginEmail || ""}
                      placeholder="Your email address"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    defaultValue={user.member?.contact?.firstName || ""}
                    placeholder="Your first name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    defaultValue={user.member?.contact?.lastName || ""}
                    placeholder="Your last name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      className="pl-10"
                      defaultValue={
                        (user.member?.contact?.phones &&
                          user.member?.contact?.phones[0]) ||
                        ""
                      }
                      placeholder="Your phone number"
                    />
                  </div>
                </div>
              </div>

              <CardFooter className="px-0 pt-4 flex justify-end">
                <UpdateButton />
              </CardFooter>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag size={18} />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                  <span className="text-3xl font-bold">{totalOrders}</span>
                  <span className="text-sm text-muted-foreground">
                    Total Orders
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                  <span className="text-3xl font-bold">${totalSpent}</span>
                  <span className="text-sm text-muted-foreground">
                    Total Spent
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/orders">View All Orders</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays size={18} />
                Account Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Member since</span>
                  <span className="text-sm">
                    {user.member?._createdDate
                      ? new Date(user.member._createdDate).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Last login</span>
                  <span className="text-sm">
                    {user.member?._updatedDate
                      ? new Date(
                          user.member.lastLoginDate
                            ? new Date(user.member.lastLoginDate)
                            : "N/A"
                        ).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Status</span>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 hover:bg-green-50"
                  >
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
