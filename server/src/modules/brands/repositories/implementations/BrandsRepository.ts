import { Brand } from "@prisma/client";

import { prisma } from "../../../../database/prisma";
import { IBrandsRepository, ICreateBrandDTO, IUpdateBrandDTO } from "../IBrandsRepository";

class BrandsRepository implements IBrandsRepository {
    private static INSTANCE: BrandsRepository;

    private constructor() {}

    public static getInstance() {
        if (!BrandsRepository.INSTANCE) {
            BrandsRepository.INSTANCE = new BrandsRepository();
        }

        return BrandsRepository.INSTANCE;
    }

    async list(includeProducts = false): Promise<Brand[]> {
        const brands = await prisma.brand.findMany({
            include: {
                products: includeProducts,
            },
        });
        return brands;
    }

    async findById(id: string): Promise<Brand> {
        const brand = await prisma.brand.findUnique({
            where: {
                id,
            },
        });

        return brand;
    }

    async findByName(name: string): Promise<Brand> {
        const brand = await prisma.brand.findUnique({
            where: {
                name,
            },
        });

        return brand;
    }

    async create({ name, image }: ICreateBrandDTO): Promise<Brand> {
        const brand = await prisma.brand.create({
            data: {
                name,
                image,
            },
        });

        return brand;
    }

    async update({ id, name, image }: IUpdateBrandDTO): Promise<Brand> {
        const updatedBrand = await prisma.brand.update({
            where: {
                id,
            },
            data: {
                name,
                image,
            },
        });

        return updatedBrand;
    }
}

export { BrandsRepository };
