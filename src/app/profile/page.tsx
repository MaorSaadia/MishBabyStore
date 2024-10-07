import Link from "next/link";
import { members } from "@wix/members";
import { format } from "timeago.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
        <div className="flex items-center justify-center h-screen text-2xl font-bold text-red-500">
          Please log in to view your profile.
        </div>
      );
    }

    // Rest of your component logic
  } catch (error) {
    console.error("Error fetching user data:", error);
    return (
      <div className="flex items-center justify-center h-screen text-2xl font-bold text-red-500">
        Unable to load profile. Please try again later.
      </div>
    );
  }

  const orderRes = await wixClient.orders.searchOrders({
    search: {
      filter: { "buyerInfo.contactId": { $eq: user?.member?.contactId } },
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateUser} className="space-y-4">
              <input
                type="text"
                hidden
                name="id"
                value={user?.member?.contactId}
              />
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  defaultValue={user.member?.profile?.nickname || "Nickname"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  defaultValue={user.member?.contact?.firstName || "FirstName"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Lastname</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  defaultValue={user.member?.contact?.lastName || "LastName"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={
                    (user.member?.contact?.phones &&
                      user.member?.contact?.phones[0]) ||
                    "+1234567"
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={user.member?.loginEmail || "Email"}
                />
              </div>
              <UpdateButton />
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">My Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderRes.orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>
                      <Link
                        href={`/orders/${order._id}`}
                        className="text-sky-600 hover:underline"
                      >
                        {order._id}
                      </Link>
                    </TableCell>
                    <TableCell>
                      ${order.priceSummary?.subtotal?.amount}
                    </TableCell>
                    <TableCell>
                      {order.recipientInfo?.address?.city}
                      {", "}
                      {order.recipientInfo?.address?.addressLine1 ||
                        order.recipientInfo?.address?.streetAddress?.name}{" "}
                      {order.recipientInfo?.address?.streetAddress?.number}
                    </TableCell>
                    <TableCell>
                      {order._createdDate && format(order._createdDate)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : order.status === "INITIALIZED"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
