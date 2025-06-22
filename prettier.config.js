// Import ordering
module.exports = {
  plugins: ["@trivago/prettier-plugin-sort-imports"],

  importOrder: [
    "^react(.*)$", // All React imports
    "^next(/.*)?$", // Next.js
    "^[a-zA-Z0-9_@](?!/)", // All other third-party packages
    "^@/(.*)$", // Internal alias imports
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
