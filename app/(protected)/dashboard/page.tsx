
import type { Metadata } from "next";
import { Suspense } from "react";

import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { OverviewContent } from "@/features/dashboard/components/overview-content";
import { getOverview } from "@/features/overview/server/get-overview";
import { requireAuth } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "Overview · Dashboard",
};

function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded-md bg-muted" />
      <div className="h-4 w-72 rounded-md bg-muted" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 rounded-xl bg-muted"
          />
        ))}
      </div>
    </div>
  );
}

async function DashboardOverviewContent() {
  const session = await requireAuth();
  const overview = await getOverview(session.user.id);

  return (
    <>
      <DashboardHeader
        title="Overview"
        description="Summary of reviews and connected repositories."
      />
      <OverviewContent overview={overview} />
    </>
  );
}

export default function DashboardOverviewPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardOverviewContent />
    </Suspense>
  );
}
