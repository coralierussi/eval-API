import { PrismaClient } from '@prisma/client'
import { Router } from "express";
import bcrypt from "bcrypt";

export const usersRouter = Router();
const prisma = new PrismaClient()


usersRouter.post('/', async (req, res) => {
  const {pseudo, motDePasse} = req.body
  const hashMdp = await bcrypt.hash(
    motDePasse,
    parseInt(process.env.SALT_ROUNDS!)
  )
  const NewUser = await prisma.user.create({
    data: {
      pseudo: pseudo,
      motDePasse : hashMdp
  }
  });
  res.status(201).json(NewUser);
})

usersRouter.get("/:id", async (req, res) => {
  const myUsers = await prisma.user.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  });
  if(!myUsers) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  else {
    res.json(myUsers)
  }
})

usersRouter.put("/:id", async (req, res) => {
  const myUsers: any = await prisma.user.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  });
  if(!myUsers) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  else {
    myUsers.pseudo = req.body.data.pseudo;
    myUsers.motDePasse = req.body.data.motDePasse;
    await myUsers.save();
    res.json(myUsers);
  }
})

usersRouter.get("/", async (req, res) => {
    let users = await prisma.user.findMany();
    const pagination = req.query.pagination as { limit?: string, start?: string};
    if (pagination && pagination.limit) {
      let start = 0;
      let end = parseInt (pagination.limit)
    }

    res.json(users)
})


usersRouter.delete("/:id", async (req, res) => {
  const myUsers: any = await prisma.user.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  });
   if(!myUsers) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  else {
    await myUsers.destroy();
    res.json({ message: "User deleted" });
  }
})