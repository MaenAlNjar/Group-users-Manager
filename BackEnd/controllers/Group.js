import prisma from "../lip/prisma.js";

export const CreatGroup = async (req, res) => {
  const { name, description } = req.body;
  try {
    const newGroup = await prisma.group.create({
      data: {
        name,
        description,
      },
    });
    res.status(200).json(newGroup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getGroups = async (req, res) => {
  try {
    const groups = await prisma.group.findMany({
      include: {
        userGroups: {
          include: {
            user: true,
          },
        },
      },
    });
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addUserToGroup = async (req, res) => {
  const { groupId, userId } = req.body;

  try {
    const existingRelation = await prisma.userGroup.findFirst({
      where: { groupId, userId },
    });

    if (existingRelation) {
      return res.status(400).json({ message: "User is already in the group." });
    }

    const newRelation = await prisma.userGroup.create({
      data: {
        groupId,
        userId,
      },
    });

    res.status(200).json(newRelation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getGroupWithId = async (req, res) => {
  const { id } = req.params;

  try {
    const group = await prisma.group.findUnique({
      where: { id: id },
      include: {
        userGroups: {
          include: {
            user: true,  
          }
        }
      },
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const users = group.userGroups.map(userGroup => userGroup.user);

    res.json({
      ...group,
      users,  
    });
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const getUsersNotInGroup = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const usersInGroup = await prisma.userGroup.findMany({
      where: { groupId },
      select: { userId: true }, 
    });

    const userIdsInGroup = usersInGroup.map((ug) => ug.userId);

    const usersNotInGroup = await prisma.user.findMany({
      where: {
        id: {
          notIn: userIdsInGroup, 
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    res.status(200).json(usersNotInGroup);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};