"use client";

import React, { useState, useEffect } from 'react';
import { FileUpload } from "@/components/FileUpload";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProductData {
    title: string;
    description: string;
    price: number;
    imageUrl: string;
}

export const Form: React.FC = () => {
    const [productData, setProductData] = useState<ProductData>({
        title: '',
        description: '',
        price: 0,
        imageUrl: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFormValid, setIsFormValid] = useState(false);

    const addProduct = useMutation(api.products.add);

    useEffect(() => {
        const { title, description, price, imageUrl } = productData;
        setIsFormValid(
            title.trim() !== '' &&
            description.trim() !== '' &&
            price > 0 &&
            imageUrl !== ''
        );
    }, [productData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProductData(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) : value,
        }));
    };

    const onUpload = (url: string) => {
        setProductData(prev => ({ ...prev, imageUrl: url }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        console.log(productData)
        try {
            await addProduct(productData);
            setProductData({
                title: '',
                description: '',
                price: 0,
                imageUrl: '',
            });
            alert('Product added successfully!');
        } catch (err) {
            setError('Failed to add product. Please try again.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <Card className="w-full max-w-lg bg-orange-50 text-black-100 shadow-lg shadow-orange-500/50">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-black-300">Add New Product</CardTitle>
                    <CardDescription className="text-center text-black-400">Fill in the details to add a new product</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-black-300">Title</Label>
                            <Input
                                type="text"
                                id="title"
                                name="title"
                                value={productData.title}
                                onChange={handleInputChange}
                                required
                                className="bg-white border-orange-700 text-black-100 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-black-300">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={productData.description}
                                onChange={handleInputChange}
                                required
                                className="bg-white border-orange-700 text-black-100 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-black-300">Price</Label>
                            <Input
                                type="number"
                                id="price"
                                name="price"
                                value={productData.price}
                                onChange={handleInputChange}
                                required
                                min="0"
                                step="0.01"
                                className="bg-white border-orange-700 text-black-100 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-black-300">Product Image</Label>
                            <FileUpload onUpload={onUpload} />
                            {productData.imageUrl && (
                                <>
                                    <Alert variant="default" className="bg-white border-orange-500">
                                        <CheckCircle2 className="h-4 w-4 text-black-500" />
                                        <AlertDescription className="text-black-300">
                                            Image uploaded successfully
                                        </AlertDescription>
                                    </Alert>
                                    <img className='rounded-md' src={productData.imageUrl} />
                                </>
                            )}

                        </div>

                        {error && (
                            <Alert variant="destructive" className="bg-red-900 border-red-700">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <Button
                            type="submit"
                            disabled={!isFormValid || isSubmitting}
                            className="w-full bg-orange-400 hover:bg-orange-700 focus:ring-orange-500 disabled:bg-orange-800 disabled:text-black-400 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/50"
                        >
                            {isSubmitting ? 'Adding Product...' : 'Add Product'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};