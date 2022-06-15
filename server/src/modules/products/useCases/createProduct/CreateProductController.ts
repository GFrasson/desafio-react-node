import { Request, Response } from "express";

import { CreateProductUseCase } from "./CreateProductUseCase";

class CreateProductController {
    constructor(private createProductUseCase: CreateProductUseCase) {}

    async handle(request: Request, response: Response): Promise<Response> {
        const { name, price, brandId } = request.body;

        const product = await this.createProductUseCase.execute({ name, price, brandId });

        return response.status(201).json(product);
    }
}

export { CreateProductController };
