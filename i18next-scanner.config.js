// i18next-scanner.config.js
module.exports = {
    input: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
    output: "./",
    options: {
        lngs: ["en", "ru", "uz"],
        ns: ["common"],          // your namespace(s)
        defaultNs: "common",
        defaultLng: "en",
        resource: {
            loadPath: "public/locales/{{lng}}/{{ns}}.json",
            savePath: "public/locales/{{lng}}/{{ns}}.json",
        },
        func: {
            list: ["t"],  // function names to scan for
            extensions: [".ts", ".tsx"],
        },
    },
};