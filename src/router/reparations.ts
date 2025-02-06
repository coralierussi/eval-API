import { PrismaClient } from '@prisma/client'
import { Router } from "express";

export const reparationsRouter = Router();
const prisma = new PrismaClient()


reparationsRouter.post('/', async (req, res) => {
  const {name, prix} = req.body
  const NewReparation = await prisma.reparations.create({
    data: {
        name : name,
        prix : prix
    }
  });
  res.status(201).json(NewReparation);
})

reparationsRouter.get("/:id", async (req, res) => {
  const myReparartions = await prisma.reparations.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  });
  if(!myReparartions) {
    res.status(404).json({ message: "instrument not found" });
    return;
  }
  else {
    res.json(myReparartions)
  }
})

reparationsRouter.put("/:id", async (req, res) => {
  const myReparartions: any = await prisma.reparations.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  });
  if(!myReparartions) {
    res.status(404).json({ message: "instrument not found" });
    return;
  }
  else {
    myReparartions.poids = req.body.poids;
    myReparartions.name = req.body.name;
    myReparartions.color = req.body.color;
    myReparartions.prix = req.body.prix;
    await myReparartions.save();
    res.json(myReparartions);
  }
})

reparationsRouter.get("/", async (req, res) => {
    let instruments = await prisma.reparations.findMany();
    const pagination = req.query.pagination as { limit?: string, start?: string};
    if (pagination && pagination.limit) {
      let start = 0;
      let end = parseInt (pagination.limit)
    }

    res.json(instruments)
})


reparationsRouter.delete("/:id", async (req, res) => {
  const myReparartions: any = await prisma.reparations.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  });
   if(!myReparartions) {
    res.status(404).json({ message: "instrument not found" });
    return;
  }
  else {
    await myReparartions.destroy();
    res.json({ message: "instrument deleted" });
  }
})