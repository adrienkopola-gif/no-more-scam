import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, ShoppingBag } from "lucide-react";
import type React from "react";
import { useState } from "react";
import type { ExternalBlob } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type Product,
  useCreateProduct,
  useGetProducts,
} from "../hooks/useQueries";
import ImageUploader from "./ImageUploader";
import ProductCard, { type LocalProduct } from "./ProductCard";

export default function ProductsScreen() {
  const { identity } = useInternetIdentity();
  const { data: products = [], isLoading } = useGetProducts();
  const createProduct = useCreateProduct();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageBlob, setImageBlob] = useState<ExternalBlob | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category) return;
    try {
      await createProduct.mutateAsync({
        name,
        description,
        price: BigInt(Math.round(Number(price))),
        category,
        imageBlob,
      });
      setOpen(false);
      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setImageBlob(null);
    } catch {
      // error handled by mutation
    }
  };

  // Map backend Product type to LocalProduct for ProductCard
  const mappedProducts: LocalProduct[] = (products as Product[]).map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
    seller: p.seller.toString(),
    imageBlob: p.imageBlob ?? undefined,
  }));

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold">Product Guide</h1>
        </div>
        {identity && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Share a Product Price</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Leather Bag"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (MAD)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 150"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leather">Leather</SelectItem>
                      <SelectItem value="ceramics">Ceramics</SelectItem>
                      <SelectItem value="textiles">Textiles</SelectItem>
                      <SelectItem value="spices">Spices</SelectItem>
                      <SelectItem value="jewelry">Jewelry</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the product..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Photo (optional)</Label>
                  <ImageUploader
                    onUploadComplete={(blob) => setImageBlob(blob)}
                    onClear={() => setImageBlob(null)}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      createProduct.isPending || !name || !price || !category
                    }
                  >
                    {createProduct.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Product"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : mappedProducts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No products shared yet. Be the first to share a price!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mappedProducts.map((product) => (
            <ProductCard key={product.id.toString()} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
