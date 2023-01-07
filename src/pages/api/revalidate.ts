import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.REVALIDATION_TOKEN) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    console.log("Revalidate URL on functions: ", req.body.url);
    await res.revalidate(req.body.url as string);
    return res.json({ revalidated: true });
  } catch (err) {
    console.log("Errow while revalidating: ", err);
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send("Error revalidating");
  }
};

export default handler;