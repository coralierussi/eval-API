import { PrismaClient } from '@prisma/client'
import { Router } from "express";

export const instrumentsRouter = Router();
const prisma = new PrismaClient()


instrumentsRouter.post('/', async (req, res) => {
  const {poids, name, color, prix} = req.body
  const NewInstrument = await prisma.instrument.create({
    data: {
      poids: poids,
      name : name,
      color : color,
      prix : prix
  }
  });
  res.status(201).json(NewInstrument);
})

instrumentsRouter.get("/:id", async (req, res) => {
  const myInstruments = await prisma.instrument.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  });
  if(!myInstruments) {
    res.status(404).json({ message: "instrument not found" });
    return;
  }
  else {
    res.json(myInstruments)
  }
})

instrumentsRouter.put("/:id", async (req, res) => {
  const myInstruments: any = await prisma.instrument.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  });
  if(!myInstruments) {
    res.status(404).json({ message: "instrument not found" });
    return;
  }
  else {
    myInstruments.poids = req.body.poids;
    myInstruments.name = req.body.name;
    myInstruments.color = req.body.color;
    myInstruments.prix = req.body.prix;
    await myInstruments.save();
    res.json(myInstruments);
  }
})

instrumentsRouter.get("/", async (req, res) => {
    let instruments = await prisma.instrument.findMany();
    const pagination = req.query.pagination as { limit?: string, start?: string};
    if (pagination && pagination.limit) {
      let start = 0;
      let end = parseInt (pagination.limit)
    }

    res.json(instruments)
})


instrumentsRouter.delete("/:id", async (req, res) => {
  const myInstruments: any = await prisma.instrument.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  });
   if(!myInstruments) {
    res.status(404).json({ message: "instrument not found" });
    return;
  }
  else {
    await myInstruments.destroy();
    res.json({ message: "instrument deleted" });
  }
})