import { DBCatchable } from '../../library/Decorators/DBCatchable';
import { INewSkill, ISkill } from '../Models/Skills';
import Skill from '../Models/Skills';
import User, { IUser } from '../Models/User';

export class SkillCRUD {
  @DBCatchable('Error creating skill')
  public static async createSkill(skill: INewSkill): Promise<ISkill> {
    return await Skill.create(skill);
  }

  @DBCatchable('Error getting skill by name')
  public static async deleteSkill(skill: string): Promise<void> {
    await Skill.findOneAndDelete({ name: skill });
  }

  @DBCatchable('Error getting skill by name')
  public static async addManySkills(skills: INewSkill[]): Promise<ISkill[]> {
    return await Skill.insertMany(skills);
  }

  @DBCatchable('Error getting skill by name')
  public static async getSkillsByName(skills: string[]): Promise<ISkill[]> {
    return await Skill.find({ name: { $in: skills } });
  }

  @DBCatchable('Error getting all skills')
  public static async getAllSkills(): Promise<ISkill[]> {
    return await Skill.find();
  }

  @DBCatchable('Error getting skill by name')
  public static async skillExists(skill: string): Promise<boolean> {
    const skillExists = await Skill.exists({ name: skill });

    return !!skillExists;
  }

  @DBCatchable('Error getting users by skill')
  public static async getUsersBySkill(skill: string): Promise<IUser[]> {
    const users = await User.find({ skills: { $in: [skill] } });

    if (!users) {
      return [];
    }

    return users;
  }
}
