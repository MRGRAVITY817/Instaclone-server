import * as bcrypt from 'bcrypt';
import { protectedResolver } from '../users.utils';
import { createWriteStream } from 'fs';
import { Resolvers } from '../types';

const resolvers: Resolvers = {
  Mutation: {
    editProfile: protectedResolver(
      async (
        _,
        {
          firstName,
          lastName,
          username,
          email,
          password: newPassword,
          bio,
          avatar,
        },
        { loggedInUser, client }
      ) => {
        try {
          let avatarUrl = null;
          if (avatar) {
            const { filename, createReadStream } = await avatar;
            const newFileName = `${loggedInUser.id}-${Date.now()}-${filename}`;
            const readStream = createReadStream();
            const writeStream = createWriteStream(
              process.cwd() + '/uploads/' + newFileName
            );
            readStream.pipe(writeStream);
            avatarUrl = `http://localhost:4000/static/${newFileName}`;
          }
          let uglyPassword = null;
          if (newPassword) {
            uglyPassword = await bcrypt.hash(newPassword, 10);
          }
          await client.user.update({
            where: {
              id: loggedInUser.id,
            },
            data: {
              firstName,
              lastName,
              username,
              email,
              bio,
              ...(uglyPassword && { password: uglyPassword }),
              ...(avatarUrl && { avatar: avatarUrl }),
            },
          });
          return {
            ok: true,
          };
        } catch (error) {
          return {
            ok: false,
            error: 'User cannot be updated',
          };
        }
      }
    ),
  },
};

export default resolvers;
