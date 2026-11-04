
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { saveInstallation } from "@/features/github/server/installation";
import { getServerSession } from "@/features/auth/actions";
import { redirect } from "next/navigation";

function buildSignInCallbackUrl(
    installationId: string,
    state: string | null
): string {
    const params = new URLSearchParams({
        installation_id: installationId,
    });

    if (state) {
        params.set("state", state);
    }

    return `/api/github/callback?${params.toString()}`;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const installationId = searchParams.get("installation_id");
    const state = searchParams.get("state");

    const session = await getServerSession();

    if (!installationId || !/^\d+$/.test(installationId)) {
        redirect(DASHBOARD_ROUTES.github);
    }

    if (!session) {
        const callbackUrl = buildSignInCallbackUrl(
            installationId,
            state
        );

        redirect(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }

    // Ensure the installation belongs to the user who initiated it.
    if (state && state !== session.user.id) {
        redirect(DASHBOARD_ROUTES.github);
    }

    await saveInstallation(
        session.user.id,
        Number(installationId)
    );

    redirect(DASHBOARD_ROUTES.github);
}
