import { NextApiHandler } from "next";
import { env } from "../../env/server.mjs";

const handler: NextApiHandler = async (req, res) => {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== env.REVALIDATION_TOKEN) {
    return res.status(401).json({ message: "Invalid token" });
  }
  if (!req.body.url) {
    return res.json({ revalidated: false });
  }
  try {
    await res.revalidate(req.body.url as string);
    return res.json({ revalidated: true });
  } catch (err) {
    console.log("Error while revalidating: ", err);
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send("Error revalidating");
  }
};

export default handler;
