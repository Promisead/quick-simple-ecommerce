"use client";

import React from 'react';
import Link from 'next/link';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Plus } from "lucide-react";

import { Id } from '@/convex/_generated/dataModel';
import { Product } from '@/types';



export default function ManageProducts() {
    const products = useQuery(api.products.getAll);
    const removeProduct = useMutation(api.products.remove);

    const handleRemove = async (id: Id<"products">) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await removeProduct({ id });
            } catch (error) {
                console.error("Failed to remove product:", error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-white p-4">
            <Card className="w-full max-w-4xl mx-auto bg-orange-50 text-black-100 shadow-lg shadow-orange-500/50">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl font-bold text-black-300">Manage Products</CardTitle>
                    <Link href="/admin/add-product">
                        <Button className="bg-green-600 hover:bg-green-700">
                            <Plus className="mr-2 h-4 w-4" /> Add Product
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    {products === undefined ? (
                        <p className="text-center text-black-400">Loading...</p>
                    ) : products.length === 0 ? (
                        <p className="text-center text-black-400">No products found.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-black-300">Title</TableHead>
                                    <TableHead className="text-black-300">Description</TableHead>
                                    <TableHead className="text-black-300">Price</TableHead>
                                    <TableHead className="text-black-300">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product: Product) => (
                                    <TableRow key={product._id}>
                                        <TableCell className="font-medium text-black-200">{product.title}</TableCell>
                                        <TableCell className="font-medium text-black-200">{product.description}</TableCell>
                                        <TableCell className="text-black-200">${product.price.toFixed(2)}</TableCell>
                                        <TableCell className="flex space-x-2">
                                            <Link href={`/admin/${product._id}/edit`}>
                                                <Button variant="outline" size="icon">
                                                    <Pencil className="h-4 w-4 text-black-400" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleRemove(product._id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-400" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}