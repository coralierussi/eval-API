import { PrismaClient } from '@prisma/client'
import { Router } from "express";
import bcrypt from "bcrypt";

export const instrumentsRouter = Router();
const prisma = new PrismaClient()


instrumentsRouter.post('/', async (req, res) => {
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

instrumentsRouter.get("/:id", async (req, res) => {
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

instrumentsRouter.put("/:id", async (req, res) => {
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

instrumentsRouter.get("/", async (req, res) => {
    let users = await prisma.user.findMany();
    const pagination = req.query.pagination as { limit?: string, start?: string};
    if (pagination && pagination.limit) {
      let start = 0;
      let end = parseInt (pagination.limit)
    }

    res.json(users)
})


instrumentsRouter.delete("/:id", async (req, res) => {
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