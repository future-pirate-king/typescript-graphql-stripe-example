import { IResolvers } from 'graphql-tools';
import { User } from './entity/User';
import * as bcryptjs from 'bcryptjs';

export const resolvers: IResolvers = {
  Query: {
    sessionUser: async (_, __, { req }) => {
      const id = req.session.userId;
      if (!id) {
        return null;
      }

      const user = await User.findOne({ where: { id } });

      return user;
    }
  },
  Mutation: {
    register: async (_: any, { email, password }) => {
      const hashedPassword = await bcryptjs.hash(password, 10);
      await User.create({
        email,
        password: hashedPassword
      }).save();

      return true;
    },
    login: async (_: any, { email, password }, { req }) => {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return null;
      }

      const valid = await bcryptjs.compare(password, user.password);

      if (!valid) {
        return null;
      }

      req.session.userId = user.id;

      return user;
    }
  }
};
