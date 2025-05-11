import type { NextApiRequest, NextApiResponse } from "next";

const VERIFY_TOKEN = "my_secret_token";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verified.");
      res.status(200).send(challenge);
    } else {
      console.log("❌ Verification failed.");
      res.status(403).end();
    }
  } else if (req.method === "POST") {
    console.log("📩 Webhook event received:");
    console.dir(req.body, { depth: null });

    const entries = req.body.entry || [];
    entries.forEach((entry: any) => {
      const changes = entry.changes || [];
      changes.forEach((change: any) => {
        if (change.field === "mention") {
          const mention = change.value;
          console.log(`👤 Νέο mention από: @${mention.username}`);
          console.log(`🖼️ Media ID: ${mention.media_id}`);
          console.log(`📅 Ώρα: ${mention.timestamp}`);
        }
      });
    });

    res.status(200).end();
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
