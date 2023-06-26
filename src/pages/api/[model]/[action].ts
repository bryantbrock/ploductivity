import { prisma } from "@/services/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { deserializePrismaQuery, handlePrismaQuery } from "prisma-hooks";

const messages: { [key: string]: string } = {
  P2002: "Name must be unique.",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const body = req.body
      ? deserializePrismaQuery(JSON.stringify(req.body))
      : {};

    const result = await handlePrismaQuery({
      action: req.query.action as any,
      count: req.query.count ?? (false as any),
      db: prisma,
      model: req.query.model as any,
      query: body.query,
    });

    return res.status(200).json(result);
  } catch (e) {
    const error = e as Error & { code?: string };

    if (error.code && messages[error.code]) {
      return res.status(422).json({ error: messages[error.code] });
    } else {
      throw error;
    }
  }
}
