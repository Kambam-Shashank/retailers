import { Redirect, useLocalSearchParams } from "expo-router";

/**
 * Local dev fallback for the design share route: /d/:retailerId/:designId
 *
 * On production (Vercel), the serverless function at
 * api/d/[retailerId]/[designId].ts intercepts this path first and serves
 * the OG meta-tag HTML for rich link previews in WhatsApp etc.
 *
 * On localhost (Expo dev server), Expo Router handles the path and this
 * component simply redirects to the actual view page with the correct params.
 */
export default function DesignShareRedirect() {
    const { retailerId, designId } = useLocalSearchParams<{
        retailerId: string;
        designId: string;
    }>();

    return (
        <Redirect
            href={`/view/${retailerId}?designId=${designId}&activeTab=designs` as any}
        />
    );
}
