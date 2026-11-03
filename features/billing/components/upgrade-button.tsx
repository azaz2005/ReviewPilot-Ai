
"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { statusButtonClass } from "@/features/dashboard/lib/status-style";
import { cn } from "@/lib/utils";
import { startProSubscription } from "@/lib/billing";

type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
};

type RazorpayCheckout = new (options: {
  key: string;
  subscription_id: string;
  name: string;
  description: string;
  handler: (response: RazorpaySuccessResponse) => Promise<void>;
  modal?: {
    ondismiss?: () => void;
  };
}) => {
  open: () => void;
};

declare global {
  interface Window {
    Razorpay?: RazorpayCheckout;
  }
}

const RAZORPAY_SCRIPT_URL =
  "https://checkout.razorpay.com/v1/checkout.js";

export function UpgradeButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    if (!key) {
      toast.error("Razorpay is not configured yet.");
      return;
    }

    if (!window.Razorpay) {
      toast.error("Checkout is still loading. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const { subscriptionId } = await startProSubscription();

      const checkout = new window.Razorpay({
        key,
        subscription_id: subscriptionId,
        name: "ReviewPilot AI",
        description: "Pro plan - unlimited AI reviews",

        handler: async (_response) => {
          toast.success(
            "Payment successful! Your Pro plan will activate shortly."
          );

          router.refresh();
          setLoading(false);
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      });

      checkout.open();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not start checkout."
      );

      setLoading(false);
    }
  }

  return (
    <>
      <Script
        src={RAZORPAY_SCRIPT_URL}
        strategy="lazyOnload"
      />

      <Button
        onClick={handleUpgrade}
        disabled={loading}
        className={cn(statusButtonClass.success)}
      >
        {loading ? "Opening checkout..." : "Upgrade to Pro"}
      </Button>
    </>
  );
}
