import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

export const authRouter = Router();
const prisma = new PrismaClient();


authRouter.post("/local", async (req, res) => {
    const { pseudo, motDePasse } = req.body;
    const userWithPseudo = await prisma.user.findFirst({ where: { pseudo: pseudo } });
    if (!userWithPseudo) {
        res.status(400).json("Pseudo or motDePasse is incorrect");
    }
    else {
        const isMdpCorrect = await bcrypt.compare(motDePasse, userWithPseudo.motDePasse);
        if (isMdpCorrect) {
            const token = jwt.sign(userWithPseudo, process.env.JWT_SECRET!);
            res.json({
                token,
                ...userWithPseudo
            });
        }
        else {
            res.status(400).json("Email or motDePasse is incorrect");
        }
    }
})