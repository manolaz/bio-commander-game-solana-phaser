/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.module.rules.push({
            test: /\.(m4a|wav|mp3)$/,
            type: 'asset/resource',
        });
        
        // Handle SVG files
        config.module.rules.push({
            test: /\.svg$/,
            type: 'asset/resource',
        });
        
        return config;
    },
    experimental: {
        esmExternals: 'loose',
    },
};

export default nextConfig;
