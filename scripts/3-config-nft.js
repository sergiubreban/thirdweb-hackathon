import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";
import dotenv from "dotenv";
dotenv.config();
const bundleDrop = sdk.getBundleDropModule(process.env.REACT_APP_BUNDLE_DROP_ADDRESS);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "BRB CONNECT DAO NFT",
        description: "This NFT will give you access to MusicDAO!",
        image: readFileSync("scripts/assets/logo.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})()