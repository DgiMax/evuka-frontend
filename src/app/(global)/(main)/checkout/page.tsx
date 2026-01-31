"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api/axios';
import { Loader2, ShieldCheck, CheckCircle, ArrowRight, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MpesaIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const CardIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [email, setEmail] = useState(user?.email || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login?next=/checkout");
    }
  }, [user, authLoading, router]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.priceValue, 0);
  const taxes = subtotal * 0.16;
  const total = subtotal + taxes;

  const handlePayment = async () => {
    if (!user) {
      toast.error("You must be logged in to complete the purchase.");
      return;
    }

    if (!email) {
      toast.error("Please enter an email address for the receipt.");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setIsLoading(true);

    try {
      const orderResponse = await api.post("/orders/", {
        items: cartItems.map((item) => ({
          [item.type]: item.slug,
          price: item.priceValue.toFixed(2),
          quantity: 1,
        })),
      });

      const orderId = orderResponse.data.id;

      const paymentResponse = await api.post(
        `/payments/initiate/${orderId}/`,
        { 
          payment_method: paymentMethod,
          email: email
        }
      );

      const paymentData = paymentResponse.data;

      if (paymentData.free_order) {
        toast.success("Order successful!");
        clearCart(); 
        router.push(paymentData.redirect_url || "/dashboard");
        return; 
      }

      if (paymentData.payment_url) {
        window.location.href = paymentData.payment_url;
      } else {
        throw new Error("Payment URL not provided by the server.");
      }
    } catch (err: any) {
      console.error("Payment Error:", err);
      const errorMessage = err.response?.data?.error || err.response?.data?.detail || "Failed to process payment.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/cart')}
            className="pl-0 text-muted-foreground hover:text-foreground hover:bg-transparent group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Cart
          </Button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-none border-border p-2">
              <CardHeader className="pb-2 border-b border-border/50">
                <CardTitle className="text-xl">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="email">Email Address for Receipt</Label>
                  <Input 
                    type="email" 
                    id="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll send the receipt and access details here.
                  </p>
                </div>
              </CardContent>
            </Card>

            {total > 0 && (
              <Card className="shadow-none border-border">
                <CardHeader className="pb-4 border-b border-border/50">
                  <CardTitle className="text-xl">Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: "card", label: "Credit / Debit Card", sub: "Instant processing", Icon: CardIcon },
                      { id: "mobile_money_mpesa", label: "M-Pesa", sub: "Pay via Mobile", Icon: MpesaIcon },
                    ].map(({ id, label, sub, Icon }) => (
                      <div 
                          key={id} 
                          onClick={() => setPaymentMethod(id)}
                          className={cn(
                              "flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all hover:bg-muted/20 relative overflow-hidden",
                              paymentMethod === id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border"
                          )}
                      >
                        <div className={cn("p-2 rounded-full shrink-0", paymentMethod === id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-foreground">{label}</p>
                            <p className="text-xs text-muted-foreground">{sub}</p>
                        </div>
                        {paymentMethod === id && (
                            <div className="absolute top-2 right-2">
                                <CheckCircle className="w-4 h-4 text-primary" />
                            </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/20 p-4 border-t border-border/50">
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground w-full">
                      <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                      <span>Transactions are secured by Paystack</span>
                    </div>
                </CardFooter>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="shadow-none border-border sticky top-6 bg-muted/20">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" /> Order Summary
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6 space-y-4">
                {cartItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">Your cart is empty.</p>
                ) : (
                    <div className="space-y-3">
                        {cartItems.map((item) => (
                            <div key={item.slug} className="flex justify-between items-start text-sm">
                                <div className="pr-4">
                                    <p className="font-medium text-foreground line-clamp-2">{item.title}</p>
                                    <span className="text-xs text-muted-foreground capitalize">{item.type}</span>
                                </div>
                                <p className="font-semibold text-foreground whitespace-nowrap">
                                    {item.priceValue === 0 ? "Free" : item.price}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>KES {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                        <span>Tax (16%)</span>
                        <span>KES {taxes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-foreground pt-2">
                        <span>Total</span>
                        <span>KES {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button 
                    onClick={handlePayment} 
                    className="w-full h-12 text-base font-bold shadow-none"
                    disabled={isLoading || cartItems.length === 0}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...
                        </>
                    ) : (
                        total === 0 ? (
                            <>
                                Claim Free Access <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                        ) : (
                            <>
                                Pay KES {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                        )
                    )}
                </Button>
              </CardFooter>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}