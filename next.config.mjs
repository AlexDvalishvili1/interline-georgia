/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            // Unsplash
            {protocol: "https", hostname: "images.unsplash.com"},

            // Supabase Storage host (from env)
            ...(process.env.NEXT_PUBLIC_SUPABASE_URL
                ? (() => {
                    try {
                        const h = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;
                        return [{protocol: "https", hostname: h}];
                    } catch {
                        return [];
                    }
                })()
                : []),

            // Add other hosts you use (safe defaults)
            {protocol: "https", hostname: "cdn.jsdelivr.net"},
            {protocol: "https", hostname: "raw.githubusercontent.com"},
            {protocol: "https", hostname: "avatars.githubusercontent.com"},
        ],
    },
};

export default nextConfig;