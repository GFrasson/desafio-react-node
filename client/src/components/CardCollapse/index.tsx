import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Plus, Minus, Pencil, Trash } from "phosphor-react";

import { promiseNotify } from "../../utils/promiseNotify";
import api from "../../services/api";

import { CardCollapseContainer } from "./style";

interface CardCollapseProps {
    brandId: string;
    brandName: string;
    brandImage?: string;
    products: Product[];
    onProductDelete: (deletedProductId: string) => void;
    onBrandDelete: (deletedBrandId: string) => void;
}

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
}

export function CardCollapse(props: CardCollapseProps) {
    const [isCardOpen, setIsCardOpen] = useState(false);

    async function handleBrandDelete(brandId: string) {
        const deleteBrand = confirm('Deseja mesmo deletar a marca? Todos os produtos associados a ela também serão excluídos!');

        if (!deleteBrand) {
            return;
        }

        try {
            await promiseNotify(api.delete(`/brands/${brandId}`), {
                pending: "Deletando marca",
                success: "Marca deletada com sucesso!",
                error: "Erro ao deletar a marca"
            });

            props.onBrandDelete(brandId);
        } catch (err) {
        }
    }

    async function handleProductDelete(productId: string) {
        const deleteProduct = confirm('Deseja mesmo deletar o produto?');

        if (!deleteProduct) {
            return;
        }

        try {
            await promiseNotify(api.delete(`/products/${productId}`), {
                pending: "Deletando produto",
                success: "Produto deletado com sucesso!",
                error: "Erro ao deletar o produto"
            });

            props.onProductDelete(productId);
        } catch (err) {
        }
    }

    return (
        <CardCollapseContainer className={`${isCardOpen && 'open'}`}>
            <div className="card-visible-content">
                <div className="w-28 h-16">
                    {
                        props.brandImage &&
                        <img className="brand-image" src={props.brandImage} alt={`Logo da marca ${props.brandName}`} />
                    }
                </div>

                <div className="title-container">
                    <h2 className="text-center">{props.brandName}</h2>
                </div>

                <div className="flex justify-center text-dark-500 actions sm:col-span-1">
                    <Link to={`brands/${props.brandId}/edit`}>
                        <Pencil size={20} />
                    </Link>
                    <button
                        className="ml-2"
                        onClick={() => handleBrandDelete(props.brandId)}
                    >
                        <Trash size={20} />
                    </button>
                    <div className="collapse-button-container">
                        <button
                            className="collapse-button"
                            onClick={() => setIsCardOpen(!isCardOpen)}
                        >
                            {
                                isCardOpen ? <Minus size={16} /> : <Plus size={16} />
                            }
                        </button>
                    </div>
                </div>
            </div>

            <div className="card-hidden-content">
                <div className="bg-light-300 shadow overflow-hidden sm:rounded-b-[0.625rem]">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Produtos</h3>
                    </div>
                    <div className="border-t border-gray-300">
                        <dl>
                            {
                                props.products.map((product) => {
                                    return (
                                        <div key={product.id} className="px-4 py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6 justify-items-center grid-align">
                                            <img className="h-14 w-14 object-contain sm:col-span-1" src={product.image} alt="Imagem de um tênis" />
                                            <dt className="text-sm font-medium text-dark-300 sm:col-span-1">{product.name}</dt>
                                            <dd className="mt-1 text-sm text-dark-500 sm:mt-0 sm:col-span-1">R${product.price.toFixed(2)}</dd>
                                            <div className="flex justify-center text-dark-500 actions sm:col-span-1">
                                                <Link to={`products/${product.id}/edit`}>
                                                    <Pencil size={20} />
                                                </Link>
                                                <button
                                                    className="ml-2"
                                                    onClick={() => handleProductDelete(product.id)}
                                                >
                                                    <Trash size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </dl>
                    </div>
                </div>
            </div>
        </CardCollapseContainer>
    );
}