/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'jgrzmsferocthxarkwwn.supabase.co',
                pathname: '/storage/v1/object/public/users-profile-pics/**',
            },
        ],
    },
};

export default nextConfig;
