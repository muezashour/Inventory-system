import SideBar from "@/component/SideBar";
import { CreatProduct } from "@/lib/actions/products";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export default async function AddProductPage() {

    const user = await getCurrentUser();

    return <div className="min-h-screen bg-gray-50">
        <SideBar currentPath="/add-product"/>

        <main className="ml-58 p-8">
             <div className="mb-8">
                <div className="flex items-center justify-between ">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Add Product Page</h1>
                        <p className="text-gray-500 text-sm">Add A New product for your Inventory</p>
                    </div>
                </div>
            </div>
            <div className="max-w-xl">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <form action={CreatProduct} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-md text-gray-700 mb-2">Product Name *</label>
                            <input type="text" id="name" required className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:border-transparent" name="name" placeholder="Enter Product Name " />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3 ">
                            <div>
                            <label htmlFor="price" className="block text-sm font-md text-gray-700 mb-2">Price *</label>
                            <input  step="0.1" type="number" id="price" required className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:border-transparent" name="price" placeholder="0.0" />
                            </div>

                            <div>
                            <label htmlFor="quantity" className="block text-sm font-md text-gray-700 mb-2">Quantity *</label>
                            <input min="0" type="number" id="quantity" required className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:border-transparent" name="quantity" placeholder="0" />
                        </div>
                        </div>
                        <div>
                            <label htmlFor="sku" className="block text-sm font-md text-gray-700 mb-2 mt-2">SKU (optinal) *</label>
                            <input type="text" id="sku"  className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:border-transparent" name="sku" placeholder="Enter Sku " />
                        </div>
                        <div>
                            <label htmlFor="LowstoclAt" className="block text-sm font-md text-gray-700 mb-2 mt-2">LowstoclAt (optinal) *</label>
                            <input   type="number" id="price"  className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:border-transparent" name="LowstoclAt" placeholder="Enter LowStock threshold" />
                        </div>
                        <div className="flex gap-5">
                            <button type="submit" className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer">Add Product</button>
                            <Link href="/inventory" className="mt-4 px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-400 cursor-pointer">Cancel</Link>
                        </div>
                    </form>
                </div>

            </div>


        </main>
    </div>
}
