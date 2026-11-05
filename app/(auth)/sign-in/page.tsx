
import React, { Suspense } from "react";
import Image from "next/image";
import type { Metadata } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSet,
} from "@/components/ui/field";

import { GithubSignInForm } from "@/features/auth/components/github-sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to ReviewPilot AI with your GitHub account.",
};

type SignInPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

function SignInContent({
  callbackUrl,
}: {
  callbackUrl?: string;
}) {
  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader className="items-center text-center">
        <div className="mb-6 flex justify-center pt-2">
          <Image
            src="/reviewpilot-ai.svg"
            alt="ReviewPilot AI"
            width={172}
            height={172}
            priority
            className="h-auto w-auto max-w-full"
          />
        </div>

        <CardTitle className="text-base">
          Welcome back
        </CardTitle>

        <CardDescription>
          Sign in with GitHub to review and manage your code.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <FieldSet>
          <FieldGroup>
            <Field>
              <GithubSignInForm callbackUrl={callbackUrl} />

              <FieldDescription className="text-center">
                We only request the permissions needed to identify your
                account. You can revoke access anytime from GitHub settings.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FieldSet>
      </CardContent>
    </Card>
  );
}

async function SignInPageContent({
  searchParams,
}: SignInPageProps) {
  const { callbackUrl } = await searchParams;

  return <SignInContent callbackUrl={callbackUrl} />;
}

export default function SignInPage(props: SignInPageProps) {
  return (
    <Suspense
      fallback={
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="items-center text-center">
            <CardTitle>Loading sign in...</CardTitle>
          </CardHeader>
        </Card>
      }
    >
      <SignInPageContent {...props} />
    </Suspense>
  );
}
