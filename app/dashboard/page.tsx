import ProductsChart from "@/component/Products-Chart";
import SideBar from "@/component/SideBar";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TrendingUp } from "lucide-react";
import type { Product } from "@prisma/client";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const userId = user.id;

  const [totalProducts, lowStockProducts, allProducts] = await Promise.all([
    prisma.product.count({ where: { userId } }),
    prisma.product.count({
      where: {
        userId,
        lowStockAt: { not: null },
        quantity: { lte: 5 },
      },
    }),
    prisma.product.findMany({
      where: { userId },
      
    }),
  ]);
  const now = new Date();
  const weeklyProductData = [];

  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - i * 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weeklabel = `${String(weekStart.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(weekStart.getDate()).padStart(2, "0")}`;
    const weekProducts = allProducts.filter((product: Product ) => {
      const productDate = new Date(product.createdAt);
      return productDate >= weekStart && productDate <= weekEnd;
    });
    weeklyProductData.push({
      weeks: weeklabel,
      products: weekProducts.length,
    });
  }

  const recent = await prisma.product.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const totalValue = allProducts.reduce(
    (sum, product) => sum + Number(product.price) * Number(product.quantity),
    0
  );
  const Instock = allProducts.filter(
    (product) => Number(product.quantity) > 5
  ).length;
  const Lowstock = allProducts.filter(
    (product) => Number(product.quantity) <= 5 && Number(product.quantity) >= 1
  ).length;
  const OutOfStock = allProducts.filter(
    (product) => Number(product.quantity) === 0
  ).length;

  const InstockPerscentage =
    totalProducts > 0 ? Math.round((Instock / totalProducts) * 100) : 0;
  const LowstockPerscentage =
    totalProducts > 0 ? Math.round((Lowstock / totalProducts) * 100) : 0;
  const OutOftockPerscentage =
    totalProducts > 0 ? Math.round((OutOfStock / totalProducts) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 ">
      <SideBar currentPath="/dashboard" />

      <main className="ml-64 p-8">
        {/* {header} */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="text-black">
              <h1 className="text-2xl font-semibold ">Dashboard</h1>
              <p className="text-sm ">
                Welcome Back , Here is an overv view of your inventory
              </p>
            </div>
          </div>
        </div>
        {/* Key metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Key Metrics
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {totalProducts}
                </div>
                <div className="text-sm text-gray-600">Total Products</div>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-xs text-green-500">
                    +{totalProducts}
                  </span>{" "}
                  <TrendingUp className="w-3 h-3 ml-1 text-green-500 " />
                </div>
              </div>

              {/*  */}
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {Number(totalValue).toFixed(0)}
                </div>
                <div className="text-sm text-gray-600">Total value</div>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-xs text-green-500">
                    +{Number(totalValue).toFixed(0)}
                  </span>{" "}
                  <TrendingUp className="w-3 h-3 ml-1 text-green-500 " />
                </div>
              </div>

              {/*  */}
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {lowStockProducts}
                </div>
                <div className="text-sm text-gray-600">Low Stock</div>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-xs text-green-500">
                    +{lowStockProducts}
                  </span>{" "}
                  <TrendingUp className="w-3 h-3 ml-1 text-green-500 " />
                </div>
              </div>
            </div>
          </div>

          {/* inventory over time  */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h1>New Products per week</h1>
            </div>
            <div className="h-48 ">
              <ProductsChart data={weeklyProductData} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-8 mb-8">
          {/* stock levels  */}
          <div className="bg-white rounded-lg border-gray-200 border p-6">
            <div className="flex item-center- justify-between mb-6">
              <h1 className="text-lg font-semibold text-gray-900">
                Stock Levels
              </h1>
            </div>
            <div className="space-y-3">
              {recent.map((product, key) => {
                const stockLevel =
                  product.quantity === 0
                    ? 0
                    : product.quantity <= (product.lowStockAt || 5)
                    ? 1
                    : 2;
                const bgColor = ["bg-red-600", "bg-yellow-400", "bg-green-600"];
                const textColor = [
                  "text-red-600",
                  "text-yellow-400",
                  "text-green-600",
                ];
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 rounded-3xl  bg-gray-50 cursor-pointer"
                  >
                    <div className=" flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${bgColor[stockLevel]}`}
                      />
                      <span className="text-xs font-medium text-gray-600 ">
                        {product.name}
                      </span>
                    </div>
                    <div className={`${textColor[stockLevel]} text-sm`}>
                      {product.quantity} in stock
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* efficiency section */}
          <div className="bg-white rounded-lg border-gray-200 border p-6">
            <div className="flex item-center justify-between mb-6">
              <h1 className="text-lg font-semibold text-gray-900">
                {" "}
                Efficiency
              </h1>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48 ">
                <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                <div
                  className=" absolute inset-0 rounded-full border-8 border-purple-600"
                  style={{
                    clipPath:
                      "polygon(50% 50%, 50% 0%, 100% 0%,100% 100%,0% 100%, 0% 50%)",
                  }}
                />
                <div className="absolute inset-0 flex  items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {InstockPerscentage}%
                    </div>
                    <div className="text-sm text-gray-600">In Stock</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex flex-col items-start justify-between text-sm text-gray-600 ">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-purple-200" />
                  <span>In Stock ({InstockPerscentage}%)</span>
                </div>

                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-purple-600" />
                  <span>Low Stock ({LowstockPerscentage}%)</span>
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-gray-200" />
                  <span>Out Of Stock ({OutOftockPerscentage}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
