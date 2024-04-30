/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/read-post.html"],
    mode: "jit",
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Noto Sans Lao"', "sans-serif"],
                serif: ['"Noto Serif Lao"', "sans-serif"],
                code: ['"Roboto Mono"', "monospace"],
                phet: ['"Phetsarath"'],
            },
            lineHeight: {
                tighter: "0.3rem",
            },
        },
    },
    plugins: [],
    corePlugins: {
        divideStyle: true,
    },
};
