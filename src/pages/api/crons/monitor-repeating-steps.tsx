import { prisma } from "@/services/prisma";

export default async function handler() {
  const repeatingSteps = await prisma.step.findMany({
    where: {
      finishedAt: { not: null },
      repeats: { gt: 1 },
    },
  });

  const stepIdsWithRemainingRepeats = repeatingSteps.reduce(
    (acc, step) =>
      (step.completed ?? 0) < step.repeats! ? acc.concat(step.id) : acc,
    [] as number[]
  );

  await prisma.step.updateMany({
    data: { completed: { increment: 1 }, finishedAt: null },
    where: { id: { in: stepIdsWithRemainingRepeats } },
  });
}
