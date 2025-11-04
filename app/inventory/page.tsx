import Pagination from "@/component/pagination";
import SideBar from "@/component/SideBar";
import { deleteProduct } from "@/lib/actions/products";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { promises } from "dns";


export default async function InventoryPage({searchParams}: {searchParams: Promise<{q?: string , page?: string}>}) {
    const user =await getCurrentUser();

    const userId = user.id;

    const params = await searchParams;
    const q = (params.q ?? "").trim();
    const page = Math.max(1, Number(params.page ?? 1));
    const pageSize = 10;
    const where = {
        userId,...(q ?{ name: { contains: q, mode: "insensitive" } as const} : {} )
    }
    const [totalAmount , items] = await Promise.all([
        prisma.product.count({ where }), prisma.product.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
        })
    ])
    const totalPages = Math.max(1, Math.ceil(totalAmount / pageSize));
    return <div className="min-h-screen bg-gray-50">
        <SideBar currentPath="/inventory" />
        <main className="ml-56 p-8">
            <div className="mb-8">
                <div className="flex items-center justify-between ">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
                        <p className="text-gray-500 text-sm">Manage Your Pruducts And Track Inventory Levels</p>
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                {/* Search */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <form action="/inventory" method="GET" className="flex gap-2">
                        <input type="text" name="q" placeholder="Search products" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent " />
                        <button className="px-6 p-2  bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer">Search</button>
                    </form>
                </div>
              {/* Products Table */}
                <div className="bg-white border border-gray-50 rounded-lg  overflow-hidden overflow-x-auto">
                    <table className="w-full cursor-pointer">
                        <thead>
                            <tr>
                                <th className="px-6 py-3  text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3  text-xs font-medium text-gray-500 uppercase">SKU</th>
                                <th className="px-6 py-3  text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="px-6 py-3  text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                <th className="px-6 py-3  text-xs font-medium text-gray-500 uppercase">Low Stock At</th>
                                <th className="px-6 py-3  text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {items.map((product, key) => (
                                <tr key={key} className="hover:bg-gray-50 text-center ">
                                    <td className="px-6 py-4  text-sm  text-gray-500 ">{product.name}</td>
                                    <td className="px-6 py-4  text-sm  text-gray-500 ">{product.sku || "-"}</td>
                                    <td className="px-6 py-4  text-sm  text-gray-900 ">${Number(product.price).toFixed(2)}</td>
                                    <td className="px-6 py-4  text-sm  text-gray-900 ">{product.quantity}</td>
                                    <td className="px-6 py-4  text-sm  text-gray-900 ">{product.lowStockAt || "-"}</td>
                                    <td className="px-6 py-4  text-sm  text-gray-900 ">
                                        <form action={async (formData: FormData) => {
                                            "use server";
                                            await deleteProduct(formData);
                                        }}>
                                            <input type="hidden" name="id" value={product.id} />
                                            <button className="text-red-600 hover:text-red-900 cursor-pointer">Delete</button>
                                    </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                {totalPages > 1 && <div className="bg-white border border-gray-200 rounded-lg p-4 flex justify-center space-x-2">
                    <Pagination currentPage={page} totalPages={totalPages} baseUrl="/inventory" searchParams={{
                        q,
                        pageSize: String(pageSize),
                    }}/>
                </div>}
            </div>
        </main>
    </div>;
}
 