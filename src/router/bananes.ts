import { PrismaClient } from '@prisma/client'
import { Router } from "express";

export const bananesRouter = Router();
const prisma = new PrismaClient()


bananesRouter.post('/', async (req, res) => {
  const {couleur, prix} = req.body
  const NewBanane = await prisma.banane.create({
    data: {
      couleur : couleur,
      prix : prix
  }
  });
  res.status(201).json(NewBanane);
})

bananesRouter.get("/:id", async (req, res) => {
  const myBananes = await prisma.instrument.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  });
  if(!myBananes) {
    res.status(404).json({ message: "instrument not found" });
    return;
  }
  else {
    res.json(myBananes)
  }
})

bananesRouter.put("/:id", async (req, res) => {
  const myBananes: any = await prisma.instrument.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  });
  if(!myBananes) {
    res.status(404).json({ message: "instrument not found" });
    return;
  }
  else {
    myBananes.couleur = req.body.couleur;
    myBananes.prix = req.body.prix;
    await myBananes.save();
    res.json(myBananes);
  }
})

bananesRouter.get("/", async (req, res) => {
    let instruments = await prisma.instrument.findMany();
    const pagination = req.query.pagination as { limit?: string, start?: string};
    if (pagination && pagination.limit) {
      let start = 0;
      let end = parseInt (pagination.limit)
    }

    res.json(instruments)
})


bananesRouter.delete("/:id", async (req, res) => {
  const myBananes: any = await prisma.instrument.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  });
   if(!myBananes) {
    res.status(404).json({ message: "instrument not found" });
    return;
  }
  else {
    await myBananes.destroy();
    res.json({ message: "instrument deleted" });
  }
})