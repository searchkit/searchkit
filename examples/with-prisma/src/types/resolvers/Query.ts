import { intArg, queryType, stringArg } from '@nexus/schema';

export const Query = queryType({
  definition(t) {

    t.list.field('feed', {
      type: 'Post',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.post.findMany({
        });
      },
    });

    t.list.field('filterPosts', {
      type: 'Post',
      args: {
        searchString: stringArg({ nullable: true }),
      },
      resolve: (parent, { searchString }, ctx) => {
        return ctx.prisma.post.findMany({
          where: {
            OR: [
              {
                title: {
                  contains: searchString,
                },
              },
              {
                content: {
                  contains: searchString,
                },
              },
            ],
          },
        });
      },
    });

    t.field('post', {
      type: 'Post',
      nullable: true,
      args: { id: intArg() },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.post.findOne({
          where: {
            id: Number(id),
          },
        });
      },
    });
  },
});
