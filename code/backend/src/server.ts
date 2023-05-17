import { config } from "dotenv";
import createApp from "./utils/createApp.js";
config();
const PORT = process.env.BACKEND_PORT || 3001;
async function main() {
  try {
    const app = createApp();
    app.listen(PORT, () =>
      console.log(
        `The server is running at http://localhost:${PORT}..` +
          " best wishes for no bugs!"
      )
    );
  } catch (err) {
    console.error("Failed to launch the backend server: ", err);
  }
}

main();
