import { mutationType, stringArg } from '@nexus/schema';

export const Mutation = mutationType({
  definition(t) {

    t.field('createPost', {
      type: 'Post',
      args: {
        title: stringArg({ nullable: false }),
        content: stringArg(),
      },
      resolve: (parent, { title, content }, ctx) => {

        return ctx.prisma.post.create({
          data: {
            title,
            content
          },
        });
      },
    });

  },
});
