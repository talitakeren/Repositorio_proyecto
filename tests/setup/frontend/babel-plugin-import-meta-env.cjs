/** Reemplaza import.meta.env en pruebas Jest (Vite → Jest). */
module.exports = function importMetaEnvPlugin() {
  return {
    visitor: {
      MetaProperty(path) {
        if (
          path.node.meta.name === "import" &&
          path.node.property.name === "meta"
        ) {
          path.replaceWithSourceString(
            '({ env: { VITE_API_URL: process.env.VITE_API_URL || "http://localhost:5001/api" } })'
          );
        }
      },
    },
  };
};
