import { Prisma } from "@prisma/client";
import { toSlug } from "../../../utils";

export const syncPostTags = async (
  tx: Prisma.TransactionClient,
  postId: string,
  userId: string,
  tags: string[]
) => {
  const upsertedTags = await Promise.all(
    tags.map((tag) => {
      const slug = toSlug(tag);
      return tx.tag.upsert({
        where: { slug },
        create: { name: tag, slug, createdBy: userId },
        update: {},
      });
    })
  );

  const upsertedTagIds = upsertedTags.map((t) => t.id);

  await tx.postTag.deleteMany({
    where: {
      postId,
      tagId: { notIn: upsertedTagIds },
    },
  });

  await tx.postTag.createMany({
    data: upsertedTags.map((t) => ({ postId, tagId: t.id })),
    skipDuplicates: true,
  });
};